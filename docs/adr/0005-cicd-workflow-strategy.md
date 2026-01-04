# ADR 0005: CI/CD Workflow Strategy with Sequential Release then Deploy

**Status:** Accepted
**Date:** 2026-01-04
**Decision Makers:** Development Team
**Tags:** `ci-cd`, `github-actions`, `semantic-release`, `deployment`, `automation`, `docker`

---

## Context

With v1.0.0 complete and semantic-release configured, we need to automate both version management and deployment. The project has specific requirements:

1. **Automated versioning** - No manual `npm run release` execution
2. **Automated deployment** - Updates pushed to main should deploy automatically
3. **Quality gates** - Tests must pass before release or deployment
4. **Self-hosted infrastructure** - Using Docker on self-hosted runners
5. **Boilerplate repository** - Must support cloning for new projects
6. **Version-tagged Docker images** - Images should be tagged with semantic version

### Infrastructure Context

- **GitHub runners** (free): Ubuntu latest, fast, limited to GitHub's infrastructure
- **Self-hosted runners**: Docker-enabled, access to `/srv/stack/globalcore-website`, same pattern as CMS
- **Existing CMS workflow**: Single workflow on self-hosted runner (deploy.yml)
- **Docker image tagging**: Need to use git tags for Docker image versions

### Problem

We need to decide:

1. Single workflow vs separate workflows for release and deploy?
2. Parallel execution vs sequential (release → deploy)?
3. GitHub runners vs self-hosted runners for each stage?
4. How to ensure deploy uses the correct version tag?

---

## Decision

We will use **two separate sequential GitHub Actions workflows**:

### 1. Release Workflow (`.github/workflows/release.yml`)

**Runs on:** GitHub runners (ubuntu-latest)
**Triggers:** Every push to `main` branch
**Purpose:** Automated versioning and testing

**Steps:**

1. Checkout code with full history
2. Setup Node.js from `.nvmrc`
3. Install dependencies (`npm ci`)
4. Run type checking (`npm run typecheck`)
5. Run unit tests (`npm test`)
6. Install Playwright browsers
7. Run E2E tests (`npm run test:e2e`)
8. Run semantic-release (creates tags/CHANGELOG if needed)

**Why GitHub runners:**

- Free compute (no cost to run tests)
- Fast startup and execution
- Standard Node.js/npm environment
- No server maintenance required
- semantic-release only needs GitHub API access

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Runs on:** Self-hosted runners (`[self-hosted, deploy, docker]`)
**Triggers:** After release workflow completes successfully
**Purpose:** Build and deploy Docker container with version tag

**Steps:**

1. Wait for release workflow completion
2. Update repository on server (`git pull`)
3. Get latest git tag (e.g., `v1.1.0`)
4. Build Docker image tagged with version
5. Restart container with new image

**Why self-hosted:**

- Direct access to `/srv/stack/` infrastructure
- Consistent with CMS deployment pattern
- Docker daemon availability
- No credential management for server access

**Why sequential (not parallel):**

- Deploy needs the version tag created by release workflow
- Docker images should be tagged with semantic version
- Ensures consistency between git tag and Docker image tag
- Prevents race condition where deploy might finish before release creates tag

---

## Rationale

### Why Sequential Execution Instead of Parallel?

**✅ Advantages:**

1. **Version Tag Availability**
   - Release workflow creates git tag (e.g., `v1.1.0`)
   - Deploy workflow pulls and uses that tag for Docker image
   - Docker image: `globalcore-website:v1.1.0`
   - Consistent versioning across git and Docker

2. **No Race Conditions**
   - Deploy always uses the latest tag
   - No possibility of deploy finishing before release
   - Predictable execution order

3. **Deployment Rollback**
   - Can easily rollback: `docker compose up globalcore-website:v1.0.0`
   - Version history tracked in Docker registry
   - Clear audit trail

4. **Debugging**
   - If deploy fails, release tag is already created
   - Can manually deploy that specific version
   - Clear separation of concerns

**❌ Tradeoffs:**

⚠️ **Slightly slower deployment**

- Deploy waits for release workflow (~2-3 minutes)
- Mitigation: Still fast overall (~5 minutes total)
- Benefit: Correctness > speed

⚠️ **Doc-only commits don't get new tags**

- semantic-release won't create tag for `docs:` commits
- Deploy will use previous version tag
- Mitigation: This is acceptable - docs updates don't warrant new Docker tag
- Alternative: Can manually trigger deploy if needed

### Why Two Workflows Instead of One?

**✅ Advantages:**

1. **Separation of Concerns**
   - Release workflow: Quality gates + versioning (pure CI)
   - Deploy workflow: Infrastructure deployment (pure CD)
   - Each workflow has single responsibility

2. **Cost Optimization**
   - Tests run on free GitHub runners
   - Self-hosted runner only for deployment (lighter load)
   - No unnecessary compute on production server

3. **Flexibility**
   - Can re-run release workflow independently
   - Can manually trigger deploy for specific tag
   - Different failure modes don't cascade

4. **Boilerplate Portability**
   - Release workflow works out-of-the-box for anyone cloning
   - Deploy workflow can be customized per project
   - Clear separation for documentation

**❌ Alternatives Considered:**

**Option A: Single workflow on GitHub runners**

- ❌ Can't access `/srv/stack/` directly
- ❌ Would require SSH credentials
- ❌ More complex setup
- ❌ Less secure (credentials in GitHub secrets)

**Option B: Single workflow on self-hosted runners**

- ❌ Uses server resources for tests
- ❌ Slower than GitHub runners
- ❌ All eggs in one basket (if runner fails, nothing works)

**Option C: Parallel workflows**

- ❌ Race condition: deploy might finish before release creates tag
- ❌ Docker image version inconsistency
- ❌ Deploy would use old tag or fail if no tag exists

---

## Consequences

### Positive

✅ **Automated release management**

- No manual `npm run release` needed
- Versions bump automatically based on conventional commits
- CHANGELOG generated from commit history

✅ **Version-tagged Docker images**

- Images tagged with semantic version: `globalcore-website:v1.1.0`
- Easy rollback to specific versions
- Clear deployment history

✅ **Consistent versioning**

- Git tag matches Docker image tag
- Single source of truth (git tags)
- Predictable and traceable

✅ **Cost effective**

- Free GitHub runners for testing
- Self-hosted only for deployment
- Minimal server load

✅ **Professional workflow**

- Industry-standard separation of CI/CD
- Clear failure points
- Easy to debug

✅ **Boilerplate ready**

- Release workflow works immediately
- Deploy workflow clearly marked as customizable
- Well-documented for future projects

### Negative

⚠️ **Two workflows to maintain**

- Need to keep both in sync with dependencies
- More workflow files to document
- Mitigation: Clear ADR and README documentation

⚠️ **Sequential execution is slightly slower**

- Deploy waits for release (~2-3 minutes)
- Total time: ~5 minutes vs ~3 minutes parallel
- Mitigation: Correctness and version consistency more important

⚠️ **Doc-only commits use previous version tag**

- `docs:` commits don't trigger new semantic version
- Docker image gets rebuilt but uses previous tag
- Mitigation: Acceptable tradeoff - docs updates don't need new version
- Mitigation: Can use `latest` tag as well for continuous updates

### Neutral

- Requires self-hosted runner setup (already exists for CMS)
- Uses GitHub Actions (already part of GitHub plan)
- Requires conventional commits (already enforced by commitlint)

---

## Implementation Details

### Workflow Dependencies

```yaml
# deploy.yml
on:
  workflow_run:
    workflows: ["Release"]
    types:
      - completed
    branches:
      - main
```

This ensures deploy only runs after release completes successfully.

### Docker Image Tagging Strategy

```bash
# In deploy workflow
VERSION=$(git describe --tags --abbrev=0)  # e.g., v1.1.0
docker build -t globalcore-website:${VERSION} .
docker tag globalcore-website:${VERSION} globalcore-website:latest
```

This creates two tags:

- `globalcore-website:v1.1.0` (specific version)
- `globalcore-website:latest` (always points to latest)

### Release Workflow Permissions

```yaml
permissions:
  contents: write # Create tags and releases
  issues: write # Comment on resolved issues
  pull-requests: write # Comment on merged PRs
```

### Deploy Workflow Location

```bash
/srv/stack/globalcore-website  # Repository location on server
/srv/stack/infra              # Docker Compose location
```

### Workflow Execution Flow

```
Push to main
    ↓
Release Workflow (GitHub runners)
    ├── Run Tests
    ├── Tests Pass? → semantic-release
    └── Create tag + CHANGELOG (if releasable commits)
    ↓
    [Workflow completed successfully]
    ↓
Deploy Workflow (Self-hosted)
    ├── Pull latest code
    ├── Get latest git tag
    ├── Build Docker image with version tag
    └── Restart container
```

### semantic-release Behavior

- **Analyzes commits** since last tag
- **Only creates release** if commit types warrant it:
  - `feat:` → minor version bump (v1.0.0 → v1.1.0)
  - `fix:`, `perf:`, etc. → patch version bump (v1.0.0 → v1.0.1)
  - `BREAKING CHANGE:` → major version bump (v1.0.0 → v2.0.0)
  - `docs:`, `chore:`, etc. → no version bump
- **Generates CHANGELOG** from conventional commits
- **Creates git tag** (e.g., v1.1.0)
- **Pushes tag** with `[skip ci]` message to avoid loops

---

## Monitoring and Rollback

### Monitoring

- **GitHub Actions UI**: View workflow runs, logs, and failures
- **Server logs**: Docker Compose logs for deployment issues
- **git tags**: Track release history
- **Docker images**: Version history in Docker registry

### Rollback

```bash
# Rollback to specific version
cd /srv/stack/infra
docker compose stop globalcore-website
docker compose up -d globalcore-website:v1.0.0

# Or rollback code and rebuild
cd /srv/stack/globalcore-website
git checkout v1.0.0
cd /srv/stack/infra
docker compose build globalcore-website
docker compose up -d globalcore-website
```

---

## Future Considerations

### Phase 2 (Post Boilerplate Separation)

After removing the boilerplate remote:

- Could add deployment notifications (Slack, Discord)
- Could add staging environment deployment (on release, before deploy)
- Could add deployment smoke tests
- Could add performance budgets
- Could implement blue-green deployment with versioned images

### If Infrastructure Changes

- Moving to Kubernetes → Update deploy workflow to use `kubectl set image`
- Adding staging environment → Add staging deploy job before production
- Multiple deployment targets → Add matrix strategy with version tags
- Container registry → Push versioned images to registry

### Handling Doc-Only Updates

If you want doc updates to trigger new versions:

**Option 1:** Use `fix(docs):` instead of `docs:`

- `fix(docs): update README` → creates patch version
- Trade-off: Inflates version numbers

**Option 2:** Manual version trigger

- Add `feat(docs)!:` for major documentation changes
- Most docs can stay as `docs:` (no version)

**Option 3:** Add `latest` tag strategy

- Always update `latest` tag
- Keep versioned tags for rollback
- **Recommended approach**

---

## Related

- **ADR 0004**: TypeScript Testing Strategy (defines test setup used by release workflow)
- **AGENTS.md**: Project Status - lists semantic-release as complete
- **README.md**: Contains workflow documentation for end users
- **.releaserc.mjs**: semantic-release configuration
- **Dockerfile**: Multi-stage Docker build for website

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions: workflow_run trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_run)
- [semantic-release Documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Self-hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Docker Image Tagging Best Practices](https://docs.docker.com/engine/reference/commandline/tag/)

---

**Review Date:** 2026-04-04 (3 months)
**Last Updated:** 2026-01-04

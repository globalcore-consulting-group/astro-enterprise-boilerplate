/**
 * Semantic Release Configuration
 *
 * Automates versioning and CHANGELOG generation based on conventional commits.
 *
 * @type {import('semantic-release').GlobalConfig}
 * @see https://semantic-release.gitbook.io/semantic-release/usage/configuration
 */
export default {
  branches: ['main'],
  plugins: [
    // Analyze commits to determine version bump
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'test', release: 'patch' },
          { type: 'chore', release: 'patch' },
        ],
      },
    ],

    // Generate release notes from commits
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance Improvements' },
            { type: 'refactor', section: 'Code Refactoring' },
            { type: 'docs', section: 'Documentation' },
            { type: 'style', section: 'Styles' },
            { type: 'test', section: 'Tests' },
            { type: 'chore', section: 'Maintenance' },
          ],
        },
      },
    ],

    // Generate CHANGELOG.md
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        changelogTitle:
          '# Changelog\n\n' +
          'All notable changes to this project will be documented in this file.\n\n' +
          'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\n' +
          'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
      },
    ],

    // Update package.json version (but don't publish to npm)
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],

    // Commit CHANGELOG.md and package.json back to repository
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

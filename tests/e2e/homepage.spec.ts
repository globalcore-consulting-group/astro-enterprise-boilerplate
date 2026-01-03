import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Resilience Architecture for Critical Systems/);
  });

  test("displays welcome heading and subtitle", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Resilience Architecture for Critical Systems" });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText("Professional consulting services for digital transformation and business growth");
    await expect(subtitle).toBeVisible();
  });

  test("renders Hero CTA buttons", async ({ page }) => {
    await page.goto("/");

    // Check Hero section CTA buttons (using test ID for scoping)
    const heroContainer = page.getByTestId("hero-cta-container");
    const primaryCta = heroContainer.getByRole("link", { name: "Book an Intro Call" });
    const secondaryCta = heroContainer.getByRole("link", { name: "How We Work (FRAS™)" });

    await expect(primaryCta).toBeVisible();
    await expect(secondaryCta).toBeVisible();
  });

  test("Hero CTA buttons have correct styling", async ({ page }) => {
    await page.goto("/");

    const heroContainer = page.getByTestId("hero-cta-container");
    const primaryCta = heroContainer.getByRole("link", { name: "Book an Intro Call" });
    await expect(primaryCta).toHaveAttribute("class", /bg-primary/);
    await expect(primaryCta).toHaveAttribute("data-slot", "button");

    const secondaryCta = heroContainer.getByRole("link", { name: "How We Work (FRAS™)" });
    await expect(secondaryCta).toHaveAttribute("class", /border/);
  });

  test("Hero CTA buttons link to correct pages", async ({ page }) => {
    await page.goto("/");

    const heroContainer = page.getByTestId("hero-cta-container");
    const primaryCta = heroContainer.getByRole("link", { name: "Book an Intro Call" });
    const secondaryCta = heroContainer.getByRole("link", { name: "How We Work (FRAS™)" });

    await expect(primaryCta).toHaveAttribute("href", "/contact");
    await expect(secondaryCta).toHaveAttribute("href", "/how-we-work");
  });

  test.describe("Responsive Design", () => {
    test.describe("Mobile (375x667)", () => {
      test("displays content correctly", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Resilience Architecture for Critical Systems" })).toBeVisible();
      });

      test("CTA buttons are stacked vertically", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");

        const ctaContainer = page.getByTestId("hero-cta-container");
        await expect(ctaContainer).toHaveCSS("flex-direction", "column");
      });
    });

    test.describe("Tablet (768x1024)", () => {
      test("displays content correctly", async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Resilience Architecture for Critical Systems" })).toBeVisible();
      });
    });

    test.describe("Desktop (1920x1080)", () => {
      test("displays content correctly", async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Resilience Architecture for Critical Systems" })).toBeVisible();
      });

      test("CTA buttons are displayed inline", async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto("/");

        const ctaContainer = page.getByTestId("hero-cta-container");
        await expect(ctaContainer).toHaveCSS("flex-direction", "row");
      });
    });
  });

  test("has proper semantic HTML structure", async ({ page }) => {
    await page.goto("/");

    // Check for main element
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check heading hierarchy
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Resilience Architecture for Critical Systems");
  });
});

test.describe("Homepage (German /de)", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/de");
    await expect(page).toHaveTitle(/Resilienz Architektur für kritische Systeme/);
  });

  test("displays German heading and subtitle", async ({ page }) => {
    await page.goto("/de");

    const heading = page.getByRole("heading", { name: "Resilienz Architektur für kritische Systeme" });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText(
      "Unabhängige Zielarchitektur und Entscheidungs-Governance für operationale Resilienz und Cyber-Compliance (DORA, NIS2)."
    );
    await expect(subtitle).toBeVisible();
  });

  test("renders German Hero CTA buttons", async ({ page }) => {
    await page.goto("/de");

    const heroContainer = page.getByTestId("hero-cta-container");
    const primaryCta = heroContainer.getByRole("link", { name: "Erstgespräch vereinbaren" });
    const secondaryCta = heroContainer.getByRole("link", { name: "So arbeiten wir (FRAS™)" });

    await expect(primaryCta).toBeVisible();
    await expect(secondaryCta).toBeVisible();
  });

  test("German Hero CTA buttons link to correct pages", async ({ page }) => {
    await page.goto("/de");

    const heroContainer = page.getByTestId("hero-cta-container");
    const primaryCta = heroContainer.getByRole("link", { name: "Erstgespräch vereinbaren" });
    const secondaryCta = heroContainer.getByRole("link", { name: "So arbeiten wir (FRAS™)" });

    await expect(primaryCta).toHaveAttribute("href", "/de/kontakt");
    await expect(secondaryCta).toHaveAttribute("href", "/de/ueber-uns");
  });
});

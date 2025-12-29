import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Welcome to GlobalCore/);
  });

  test("displays welcome heading and subtitle", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Welcome to GlobalCore" });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText("Professional consulting services for digital transformation and business growth");
    await expect(subtitle).toBeVisible();
  });

  test("renders CTA buttons", async ({ page }) => {
    await page.goto("/");

    // Check both CTA buttons are present
    const primaryCta = page.getByRole("link", { name: "Get in touch" });
    const secondaryCta = page.getByRole("link", { name: "Learn more" });

    await expect(primaryCta).toBeVisible();
    await expect(secondaryCta).toBeVisible();
  });

  test("CTA buttons have correct styling", async ({ page }) => {
    await page.goto("/");

    const primaryCta = page.getByRole("link", { name: "Get in touch" });
    await expect(primaryCta).toHaveAttribute("class", /bg-primary/);
    await expect(primaryCta).toHaveAttribute("data-slot", "button");

    const secondaryCta = page.getByRole("link", { name: "Learn more" });
    await expect(secondaryCta).toHaveAttribute("class", /border/);
  });

  test("CTA buttons link to correct pages", async ({ page }) => {
    await page.goto("/");

    const primaryCta = page.getByRole("link", { name: "Get in touch" });
    const secondaryCta = page.getByRole("link", { name: "Learn more" });

    await expect(primaryCta).toHaveAttribute("href", "/contact");
    await expect(secondaryCta).toHaveAttribute("href", "/about");
  });

  test.describe("Responsive Design", () => {
    test.describe("Mobile (375x667)", () => {
      test("displays content correctly", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();
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
        await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();
      });
    });

    test.describe("Desktop (1920x1080)", () => {
      test("displays content correctly", async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();
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
    await expect(h1).toHaveText("Welcome to GlobalCore");
  });
});

test.describe("Homepage (German /de)", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/de");
    await expect(page).toHaveTitle(/Willkommen bei GlobalCore/);
  });

  test("displays German heading and subtitle", async ({ page }) => {
    await page.goto("/de");

    const heading = page.getByRole("heading", { name: "Willkommen bei GlobalCore" });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText(
      "Professionelle Beratungsdienstleistungen für digitale Transformation und Geschäftswachstum"
    );
    await expect(subtitle).toBeVisible();
  });

  test("renders German CTA buttons", async ({ page }) => {
    await page.goto("/de");

    const primaryCta = page.getByRole("link", { name: "Kontakt aufnehmen" });
    const secondaryCta = page.getByRole("link", { name: "Mehr erfahren" });

    await expect(primaryCta).toBeVisible();
    await expect(secondaryCta).toBeVisible();
  });

  test("German CTA buttons link to correct pages", async ({ page }) => {
    await page.goto("/de");

    const primaryCta = page.getByRole("link", { name: "Kontakt aufnehmen" });
    const secondaryCta = page.getByRole("link", { name: "Mehr erfahren" });

    await expect(primaryCta).toHaveAttribute("href", "/de/kontakt");
    await expect(secondaryCta).toHaveAttribute("href", "/de/ueber-uns");
  });
});

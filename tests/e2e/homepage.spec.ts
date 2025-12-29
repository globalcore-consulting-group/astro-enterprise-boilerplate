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

  test("buttons are interactive", async ({ page }) => {
    await page.goto("/");

    const primaryButton = page.getByRole("button", { name: "Primary Button" });

    // Hover over button
    await primaryButton.hover();
    await expect(primaryButton).toBeVisible();

    // Click button
    await primaryButton.click();
    // Button should still be visible after click
    await expect(primaryButton).toBeVisible();
  });

  test("page is responsive", async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole("heading", { name: "Welcome to GlobalCore" })).toBeVisible();
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

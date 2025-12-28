import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GlobalCore Website/);
  });

  test("displays welcome heading and subtitle", async ({ page }) => {
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Welcome to GlobalCore" });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText("Tailwind CSS v4 + Starwind UI is ready to use!");
    await expect(subtitle).toBeVisible();
  });

  test("renders all button variants", async ({ page }) => {
    await page.goto("/");

    // Check all button variants are present
    const primaryButton = page.getByRole("button", { name: "Primary Button" });
    const secondaryButton = page.getByRole("button", { name: "Secondary Button" });
    const outlineButton = page.getByRole("button", { name: "Outline Button" });
    const ghostButton = page.getByRole("button", { name: "Ghost Button" });

    await expect(primaryButton).toBeVisible();
    await expect(secondaryButton).toBeVisible();
    await expect(outlineButton).toBeVisible();
    await expect(ghostButton).toBeVisible();
  });

  test("buttons have correct styling classes", async ({ page }) => {
    await page.goto("/");

    const primaryButton = page.getByRole("button", { name: "Primary Button" });
    await expect(primaryButton).toHaveAttribute("class", /bg-primary/);
    await expect(primaryButton).toHaveAttribute("data-slot", "button");

    const outlineButton = page.getByRole("button", { name: "Outline Button" });
    await expect(outlineButton).toHaveAttribute("class", /border/);
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

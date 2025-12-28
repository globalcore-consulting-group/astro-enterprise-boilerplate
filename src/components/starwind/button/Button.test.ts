import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, it, describe } from "vitest";
import Button from "./Button.astro";

describe("Button Component", () => {
  it("renders button element by default", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      slots: { default: "Click me" },
    });

    expect(result).toContain("<button");
    expect(result).toContain("Click me");
    expect(result).toContain('data-slot="button"');
  });

  it("renders anchor element when href is provided", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { href: "https://example.com" },
      slots: { default: "Link" },
    });

    expect(result).toContain("<a");
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain("Link");
  });

  it("applies default variant and size", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      slots: { default: "Default" },
    });

    // Default variant: bg-foreground text-background
    expect(result).toContain("bg-foreground");
    expect(result).toContain("text-background");

    // Default size: h-11 px-4 py-2 text-base
    expect(result).toContain("h-11");
    expect(result).toContain("px-4");
  });

  it("applies primary variant", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { variant: "primary" },
      slots: { default: "Primary" },
    });

    expect(result).toContain("bg-primary");
    expect(result).toContain("text-primary-foreground");
    expect(result).toContain("hover:bg-primary/90");
  });

  it("applies secondary variant", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { variant: "secondary" },
      slots: { default: "Secondary" },
    });

    expect(result).toContain("bg-secondary");
    expect(result).toContain("text-secondary-foreground");
  });

  it("applies outline variant", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { variant: "outline" },
      slots: { default: "Outline" },
    });

    expect(result).toContain("border");
    expect(result).toContain("bg-background");
  });

  it("applies ghost variant", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { variant: "ghost" },
      slots: { default: "Ghost" },
    });

    expect(result).toContain("hover:bg-muted");
    expect(result).toContain("hover:text-foreground");
  });

  it("applies semantic variants (info, success, warning, error)", async () => {
    const container = await AstroContainer.create();

    const infoResult = await container.renderToString(Button, {
      props: { variant: "info" },
      slots: { default: "Info" },
    });
    expect(infoResult).toContain("bg-info");

    const successResult = await container.renderToString(Button, {
      props: { variant: "success" },
      slots: { default: "Success" },
    });
    expect(successResult).toContain("bg-success");

    const warningResult = await container.renderToString(Button, {
      props: { variant: "warning" },
      slots: { default: "Warning" },
    });
    expect(warningResult).toContain("bg-warning");

    const errorResult = await container.renderToString(Button, {
      props: { variant: "error" },
      slots: { default: "Error" },
    });
    expect(errorResult).toContain("bg-error");
  });

  it("applies small size", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { size: "sm" },
      slots: { default: "Small" },
    });

    expect(result).toContain("h-9");
    expect(result).toContain("px-3");
    expect(result).toContain("text-sm");
  });

  it("applies large size", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { size: "lg" },
      slots: { default: "Large" },
    });

    expect(result).toContain("h-12");
    expect(result).toContain("px-8");
    expect(result).toContain("text-lg");
  });

  it("applies icon sizes", async () => {
    const container = await AstroContainer.create();

    const iconResult = await container.renderToString(Button, {
      props: { size: "icon" },
      slots: { default: "Icon" },
    });
    expect(iconResult).toContain("size-11");

    const iconSmResult = await container.renderToString(Button, {
      props: { size: "icon-sm" },
      slots: { default: "IconSm" },
    });
    expect(iconSmResult).toContain("size-9");

    const iconLgResult = await container.renderToString(Button, {
      props: { size: "icon-lg" },
      slots: { default: "IconLg" },
    });
    expect(iconLgResult).toContain("size-12");
  });

  it("accepts custom className", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { class: "custom-class" },
      slots: { default: "Custom" },
    });

    expect(result).toContain("custom-class");
  });

  it("applies base styles for accessibility", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      slots: { default: "Accessible" },
    });

    // Base styles should include focus ring and transition
    expect(result).toContain("focus-visible:ring-3");
    expect(result).toContain("transition-all");
    expect(result).toContain("outline-none");
  });

  it("includes disabled state styles", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: { disabled: true },
      slots: { default: "Disabled" },
    });

    expect(result).toContain("disabled:pointer-events-none");
    expect(result).toContain("disabled:opacity-50");
    expect(result).toContain("disabled");
  });

  it("passes through additional HTML attributes", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        type: "submit",
        "aria-label": "Submit form",
        "data-testid": "submit-button",
      },
      slots: { default: "Submit" },
    });

    expect(result).toContain('type="submit"');
    expect(result).toContain('aria-label="Submit form"');
    expect(result).toContain('data-testid="submit-button"');
  });
});

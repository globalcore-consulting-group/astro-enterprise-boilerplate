import { describe, it, expect } from "vitest";
import { isValidSlug, toSlug } from "./Slug";

describe("Slug value object", () => {
  it("validates common slug formats", () => {
    expect(isValidSlug("home")).toBe(true);
    expect(isValidSlug("how-we-work")).toBe(true);
    expect(isValidSlug("insights-2026")).toBe(true);

    expect(isValidSlug("How-we-work")).toBe(false); // uppercase not allowed
    expect(isValidSlug("with spaces")).toBe(false);
    expect(isValidSlug("double--dash")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("trailing-")).toBe(false);
    expect(isValidSlug("slash/inside")).toBe(false);
    expect(isValidSlug("underscore_inside")).toBe(false);
  });

  it("normalizes strings into slugs", () => {
    expect(toSlug(" How we Work ")).toBe("how-we-work");
    expect(toSlug("Hello_world!!")).toBe("hello-world");
    expect(toSlug("a---b")).toBe("a-b");
    expect(toSlug("  ---  ")).toBe("");
  });
});

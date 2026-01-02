import { describe, it, expect } from "vitest";
import { isInternalPath, isHttpUrl, isValidUrl } from "./Url";

describe("Url value object", () => {
  it("accepts internal paths", () => {
    expect(isInternalPath("/")).toBe(true);
    expect(isInternalPath("/contact")).toBe(true);
    expect(isInternalPath("/de/how-we-work")).toBe(true);

    expect(isInternalPath("//cdn.example.com/file")).toBe(false); // protocol-relative not allowed
    expect(isInternalPath("contact")).toBe(false); // must start with "/"
    expect(isInternalPath("/with space")).toBe(false);
  });

  it("accepts http(s) absolute URLs", () => {
    expect(isHttpUrl("https://example.com")).toBe(true);
    expect(isHttpUrl("http://example.com/path?x=1")).toBe(true);

    expect(isHttpUrl("ftp://example.com")).toBe(false);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("https://example.com/with space")).toBe(false);
  });

  it("validates either internal or http(s)", () => {
    expect(isValidUrl("/contact")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);

    expect(isValidUrl("data:text/plain,hello")).toBe(false);
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl(null)).toBe(false);
  });
});

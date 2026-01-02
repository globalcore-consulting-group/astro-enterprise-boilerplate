import { describe, it, expect } from "vitest";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isValidLocale, getLocaleOrDefault } from "./Locale";

describe("Locale value object", () => {
  it("exposes supported locales and default locale", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "de"]);
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("validates locales with a runtime guard", () => {
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("de")).toBe(true);

    expect(isValidLocale("es")).toBe(false);
    expect(isValidLocale("EN")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale(null)).toBe(false);
    expect(isValidLocale(undefined)).toBe(false);
    expect(isValidLocale(123)).toBe(false);
  });

  it("returns locale or falls back to default", () => {
    expect(getLocaleOrDefault("de")).toBe("de");
    expect(getLocaleOrDefault("es")).toBe(DEFAULT_LOCALE);
    expect(getLocaleOrDefault(undefined)).toBe(DEFAULT_LOCALE);
  });
});

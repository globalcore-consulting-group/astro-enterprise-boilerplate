import { describe, it, expect } from "vitest";
import { buildPath, getRouteKeyFromPath, getRouteSlugs } from "./translations";

describe("Route Helpers", () => {
  describe("buildPath", () => {
    it("should build EN paths without locale prefix", () => {
      expect(buildPath("about", "en")).toBe("/about");
      expect(buildPath("services", "en")).toBe("/services");
      expect(buildPath("contact", "en")).toBe("/contact");
      expect(buildPath("domains", "en")).toBe("/domains");
      expect(buildPath("privacy", "en")).toBe("/privacy");
      expect(buildPath("imprint", "en")).toBe("/impressum");
    });

    it("should build DE paths with locale prefix and translated slugs", () => {
      expect(buildPath("about", "de")).toBe("/de/ueber-uns");
      expect(buildPath("services", "de")).toBe("/de/dienstleistungen");
      expect(buildPath("contact", "de")).toBe("/de/kontakt");
      expect(buildPath("domains", "de")).toBe("/de/domaenen");
      expect(buildPath("privacy", "de")).toBe("/de/datenschutz");
      expect(buildPath("imprint", "de")).toBe("/de/impressum");
    });

    it("should handle home route correctly", () => {
      expect(buildPath("home", "en")).toBe("/");
      expect(buildPath("home", "de")).toBe("/de");
    });
  });

  describe("getRouteKeyFromPath", () => {
    it("should extract route key from EN paths", () => {
      expect(getRouteKeyFromPath("/about")).toBe("about");
      expect(getRouteKeyFromPath("/services")).toBe("services");
      expect(getRouteKeyFromPath("/contact")).toBe("contact");
      expect(getRouteKeyFromPath("/domains")).toBe("domains");
      expect(getRouteKeyFromPath("/privacy")).toBe("privacy");
      expect(getRouteKeyFromPath("/impressum")).toBe("imprint");
    });

    it("should extract route key from DE paths", () => {
      expect(getRouteKeyFromPath("/de/ueber-uns")).toBe("about");
      expect(getRouteKeyFromPath("/de/dienstleistungen")).toBe("services");
      expect(getRouteKeyFromPath("/de/kontakt")).toBe("contact");
      expect(getRouteKeyFromPath("/de/domaenen")).toBe("domains");
      expect(getRouteKeyFromPath("/de/datenschutz")).toBe("privacy");
      expect(getRouteKeyFromPath("/de/impressum")).toBe("imprint");
    });

    it("should handle home routes", () => {
      expect(getRouteKeyFromPath("/")).toBe("home");
      expect(getRouteKeyFromPath("/de")).toBe("home");
    });

    it("should handle trailing slashes", () => {
      expect(getRouteKeyFromPath("/about/")).toBe("about");
      expect(getRouteKeyFromPath("/de/ueber-uns/")).toBe("about");
    });

    it("should return undefined for unknown paths", () => {
      expect(getRouteKeyFromPath("/unknown")).toBeUndefined();
      expect(getRouteKeyFromPath("/de/unknown")).toBeUndefined();
    });
  });

  describe("getRouteSlugs", () => {
    it("should return EN route slugs excluding home", () => {
      const slugs = getRouteSlugs("en");
      expect(slugs).toContain("about");
      expect(slugs).toContain("services");
      expect(slugs).toContain("contact");
      expect(slugs).toContain("domains");
      expect(slugs).toContain("privacy");
      expect(slugs).toContain("impressum");
      expect(slugs).not.toContain(""); // home should be excluded
    });

    it("should return DE route slugs excluding home", () => {
      const slugs = getRouteSlugs("de");
      expect(slugs).toContain("ueber-uns");
      expect(slugs).toContain("dienstleistungen");
      expect(slugs).toContain("kontakt");
      expect(slugs).toContain("domaenen");
      expect(slugs).toContain("datenschutz");
      expect(slugs).toContain("impressum");
      expect(slugs).not.toContain(""); // home should be excluded
    });
  });

  describe("Language switching scenario", () => {
    it("should correctly generate alternate URL when switching from EN to DE", () => {
      const currentPath = "/about";
      const currentRouteKey = getRouteKeyFromPath(currentPath);
      const alternateUrl = currentRouteKey ? buildPath(currentRouteKey, "de") : "/de";

      expect(currentRouteKey).toBe("about");
      expect(alternateUrl).toBe("/de/ueber-uns");
    });

    it("should correctly generate alternate URL when switching from DE to EN", () => {
      const currentPath = "/de/ueber-uns";
      const currentRouteKey = getRouteKeyFromPath(currentPath);
      const alternateUrl = currentRouteKey ? buildPath(currentRouteKey, "en") : "/";

      expect(currentRouteKey).toBe("about");
      expect(alternateUrl).toBe("/about");
    });

    it("should handle home page language switching", () => {
      // EN home -> DE home
      const enHomeRouteKey = getRouteKeyFromPath("/");
      const deHomeUrl = enHomeRouteKey ? buildPath(enHomeRouteKey, "de") : "/de";
      expect(deHomeUrl).toBe("/de");

      // DE home -> EN home
      const deHomeRouteKey = getRouteKeyFromPath("/de");
      const enHomeUrl = deHomeRouteKey ? buildPath(deHomeRouteKey, "en") : "/";
      expect(enHomeUrl).toBe("/");
    });
  });
});

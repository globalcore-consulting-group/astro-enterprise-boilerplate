import { describe, it, expect } from "vitest";
import { t, getNamespace, buildPath, getRouteKeyFromPath, getRouteSlugs, translations } from "./translations";

describe("Translation Functions", () => {
  describe("t", () => {
    it("should return correct EN translations for nav namespace", () => {
      expect(t("en", "nav", "home")).toBe("Home");
      expect(t("en", "nav", "about")).toBe("About");
      expect(t("en", "nav", "services")).toBe("Services");
      expect(t("en", "nav", "contact")).toBe("Contact");
      expect(t("en", "nav", "domains")).toBe("Domains");
    });

    it("should return correct DE translations for nav namespace", () => {
      expect(t("de", "nav", "home")).toBe("Startseite");
      expect(t("de", "nav", "about")).toBe("Über uns");
      expect(t("de", "nav", "services")).toBe("Dienstleistungen");
      expect(t("de", "nav", "contact")).toBe("Kontakt");
      expect(t("de", "nav", "domains")).toBe("Domänen");
    });

    it("should return correct EN translations for ui namespace", () => {
      expect(t("en", "ui", "learnMore")).toBe("Learn more");
      expect(t("en", "ui", "getStarted")).toBe("Get started");
      expect(t("en", "ui", "backToHome")).toBe("Back to Home");
      expect(t("en", "ui", "comingSoon")).toBe("This page is coming soon.");
      expect(t("en", "ui", "loading")).toBe("Loading...");
    });

    it("should return correct DE translations for ui namespace", () => {
      expect(t("de", "ui", "learnMore")).toBe("Mehr erfahren");
      expect(t("de", "ui", "getStarted")).toBe("Jetzt starten");
      expect(t("de", "ui", "backToHome")).toBe("Zurück zur Startseite");
      expect(t("de", "ui", "comingSoon")).toBe("Diese Seite kommt bald.");
      expect(t("de", "ui", "loading")).toBe("Wird geladen...");
    });

    it("should return correct translations for footer namespace", () => {
      expect(t("en", "footer", "privacyPolicy")).toBe("Privacy Policy");
      expect(t("de", "footer", "privacyPolicy")).toBe("Datenschutz");
      expect(t("en", "footer", "imprint")).toBe("Imprint");
      expect(t("de", "footer", "imprint")).toBe("Impressum");
      expect(t("en", "footer", "allRightsReserved")).toBe("All rights reserved.");
      expect(t("de", "footer", "allRightsReserved")).toBe("Alle Rechte vorbehalten.");
    });

    it("should return correct translations for sections namespace", () => {
      expect(t("en", "sections", "howWeWork")).toBe("How We Work");
      expect(t("de", "sections", "howWeWork")).toBe("So arbeiten wir");
      expect(t("en", "sections", "frameSprint")).toBe("FRAME Sprint");
      expect(t("de", "sections", "frameSprint")).toBe("FRAME Sprint");
    });
  });

  describe("getNamespace", () => {
    it("should return entire nav namespace for EN", () => {
      const navEN = getNamespace("en", "nav");
      expect(navEN).toEqual({
        home: "Home",
        about: "About",
        services: "Services",
        contact: "Contact",
        domains: "Domains",
      });
    });

    it("should return entire nav namespace for DE", () => {
      const navDE = getNamespace("de", "nav");
      expect(navDE).toEqual({
        home: "Startseite",
        about: "Über uns",
        services: "Dienstleistungen",
        contact: "Kontakt",
        domains: "Domänen",
      });
    });

    it("should return entire routes namespace for EN", () => {
      const routesEN = getNamespace("en", "routes");
      expect(routesEN.about).toBe("about");
      expect(routesEN.services).toBe("services");
      expect(routesEN.contact).toBe("contact");
    });

    it("should return entire routes namespace for DE", () => {
      const routesDE = getNamespace("de", "routes");
      expect(routesDE.about).toBe("ueber-uns");
      expect(routesDE.services).toBe("dienstleistungen");
      expect(routesDE.contact).toBe("kontakt");
    });
  });

  describe("Translation schema consistency", () => {
    it("should have the same namespace keys across all locales", () => {
      const enNamespaces = Object.keys(translations.en);
      const deNamespaces = Object.keys(translations.de);
      expect(enNamespaces).toEqual(deNamespaces);
    });

    it("should have the same nav keys across all locales", () => {
      const enNavKeys = Object.keys(translations.en.nav);
      const deNavKeys = Object.keys(translations.de.nav);
      expect(enNavKeys).toEqual(deNavKeys);
    });

    it("should have the same ui keys across all locales", () => {
      const enUiKeys = Object.keys(translations.en.ui);
      const deUiKeys = Object.keys(translations.de.ui);
      expect(enUiKeys).toEqual(deUiKeys);
    });

    it("should have the same footer keys across all locales", () => {
      const enFooterKeys = Object.keys(translations.en.footer);
      const deFooterKeys = Object.keys(translations.de.footer);
      expect(enFooterKeys).toEqual(deFooterKeys);
    });

    it("should have the same routes keys across all locales", () => {
      const enRoutesKeys = Object.keys(translations.en.routes);
      const deRoutesKeys = Object.keys(translations.de.routes);
      expect(enRoutesKeys).toEqual(deRoutesKeys);
    });

    it("should have the same sections keys across all locales", () => {
      const enSectionsKeys = Object.keys(translations.en.sections);
      const deSectionsKeys = Object.keys(translations.de.sections);
      expect(enSectionsKeys).toEqual(deSectionsKeys);
    });
  });
});

describe("Route Helpers", () => {
  describe("buildPath", () => {
    it("should build EN paths without locale prefix", () => {
      expect(buildPath("about", "en")).toBe("/about");
      expect(buildPath("services", "en")).toBe("/services");
      expect(buildPath("contact", "en")).toBe("/contact");
      expect(buildPath("domains", "en")).toBe("/domains");
      expect(buildPath("privacy", "en")).toBe("/privacy");
      expect(buildPath("imprint", "en")).toBe("/imprint");
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
      expect(getRouteKeyFromPath("/imprint")).toBe("imprint");
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
      expect(slugs).toContain("imprint");
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

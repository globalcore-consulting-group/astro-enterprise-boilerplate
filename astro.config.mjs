import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    preview: {
      allowedHosts: ["website.myhelix.io"],
    },
  },

  // i18n configuration
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    routing: {
      prefixDefaultLocale: false, // EN has no prefix (/about), DE has prefix (/de/ueber-uns)
    },
  },
});

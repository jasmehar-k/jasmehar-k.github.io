import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteSitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    viteSitemap({
      hostname: "https://jasmehar-k.github.io",
    }),
  ],
});

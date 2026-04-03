import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

function normalizeBase() {
  const envBase = process.env.GITHUB_PAGES_BASE?.trim();
  if (!envBase) return "/";
  if (envBase === "/") return "/";
  return `/${envBase.replace(/^\/+|\/+$/g, "")}/`;
}

export default defineConfig({
  base: normalizeBase(),
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
    },
  },
});

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("./assets", import.meta.url)),
    },
  },
}));

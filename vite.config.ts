import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

const root = import.meta.dirname;

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  build: {
    outDir: resolve(root, "custom_components/ready_home/dist"),
    emptyOutDir: true,
    sourcemap: true,
    target: "es2022",
    rolldownOptions: {
      input: {
        "ready-home-panel": resolve(root, "frontend/src/panel.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        format: "es",
      },
    },
  },
});

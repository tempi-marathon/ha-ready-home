import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "custom_components/ready_home/dist"),
    emptyOutDir: true,
    sourcemap: true,
    target: "es2022",
    minify: "esbuild",
    rollupOptions: {
      input: {
        "ready-home": resolve(__dirname, "frontend/src/main.ts"),
        "ready-home-panel": resolve(__dirname, "frontend/src/panel.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        format: "es",
      },
    },
  },
});

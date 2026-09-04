import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "frontend/src/main.ts"),
      name: "ReadyHomeCards",
      formats: ["es"],
      fileName: () => "ready-home.js",
    },
    outDir: resolve(__dirname, "custom_components/ready_home/dist"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    target: "es2022",
    minify: "esbuild",
  },
});

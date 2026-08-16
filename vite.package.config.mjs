import { defineConfig } from "vite";

const external = (id) => !id.startsWith(".") && !id.startsWith("/");

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist/package",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: "src/components/ui/index.ts",
        tokens: "src/tokens/generated.ts",
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external,
      output: {
        exports: "named",
      },
    },
  },
});

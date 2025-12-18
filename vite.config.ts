import react from "@vitejs/plugin-react";
import path from 'path';
import { defineConfig } from "vite";
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    target: 'es2018',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})

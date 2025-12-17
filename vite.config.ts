import react from "@vitejs/plugin-react";
import path = require("path");
import { defineConfig } from "vite";
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})

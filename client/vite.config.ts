// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

const API_TARGET =
  process.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    open: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});

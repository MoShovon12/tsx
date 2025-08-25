// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

const API_TARGET = (process.env.VITE_API_URL?.replace(/\/$/, "")) || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    open: true,
    // don't set port here (CLI sets 5173 already)
    // don't set strictPort here (CLI passes --strictPort)
    proxy: { "/api": { target: API_TARGET, changeOrigin: true } }
  }
});

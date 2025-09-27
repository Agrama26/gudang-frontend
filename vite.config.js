import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { SpeedInsights } from "@vercel/speed-insights/next"

// Config universal: support localhost, ngrok, LAN, deploy
export default defineConfig({
  plugins: [react(), SpeedInsights()],
  server: {
    host: true, // biar bisa diakses dari luar localhost (contoh: LAN, ngrok)
    port: 5173, // port default Vite
    allowedHosts: true, // izinkan semua host (ngrok, localtunnel, dll)
  },
  preview: {
    host: true, // biar vite preview juga bisa dipakai publik
    port: 4173,
    allowedHosts: true,
  },
});

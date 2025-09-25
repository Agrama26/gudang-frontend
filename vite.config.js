import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config universal: support localhost, ngrok, LAN, deploy
export default defineConfig({
  plugins: [react()],
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

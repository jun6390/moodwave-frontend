import { defineConfig } from "vite";

const BACKEND_URL = "https://movewave-backend-production.up.railway.app";

export default defineConfig({
  publicDir: "public",

  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/oauth2": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/login": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/logout": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
    },
  },

  preview: {
    host: "127.0.0.1",
    port: 4173,
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/oauth2": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/login": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
      "/logout": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: true,
        xfwd: true,
      },
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});

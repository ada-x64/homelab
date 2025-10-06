import { join } from "path";

import ViteReact from "@vitejs/plugin-react";
import ViteFastifyReact from "@fastify/react/plugin";
import TailwindCSS from "@tailwindcss/vite";
import FlowbiteReact from "flowbite-react/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";

export default {
  root: join(import.meta.dirname, "src", "client"),
  build: {
    emptyOutDir: true,
    outDir: join(import.meta.dirname, "dist"),
  },
  plugins: [
    ViteReact(),
    ViteFastifyReact({
      ts: true,
    }),
    TailwindCSS(),
    FlowbiteReact(),
    VitePWA({
      includeAssets: [
        "src/client/public/pwa-64x64.png",
        "src/client/public/pwa-192x192.png",
        "src/client/public/pwa-512x512.png",
        "src/client/public/maskable-icon-192x192.png",
        "src/client/public/favicon.ico",
        "src/client/public/preview-landscape.png",
        "src/client/public/preview-portrait.png",
      ],
      manifest: {
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        name: "Homelab",
        description: "Monitor your homelab",
        theme_color: "#fff",
        registerType: "autoUpdate",
        screenshots: [
          {
            src: "preview-landscape.png",
            form_factor: "wide",
          },
          {
            src: "preview-portrait.png",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
};

import { join } from "path";

import viteReact from "@vitejs/plugin-react";
import viteFastifyReact from "@fastify/react/plugin";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default {
  root: join(import.meta.dirname, "src", "client"),
  build: {
    emptyOutDir: true,
    outDir: join(import.meta.dirname, "dist"),
  },
  plugins: [
    viteReact(),
    viteFastifyReact({
      ts: true,
      spa: true,
      useRelativePaths: true,
    }),
    tailwindcss(),
    flowbiteReact(),
  ],
};

// React 18's non-streaming server-side rendering function
import { renderToString } from "react-dom/server";
import fs from "fs";
import { type FastifyViteOptions } from "@fastify/vite";

// Used to safely serialize JavaScript into
// <script> tags, preventing a few types of attack
import * as devalue from "devalue";
import { ConfigSchema } from "../types.js";
import clientIndex from "../client/index.js";

export const createRenderFunction: FastifyViteOptions["createRenderFunction"] =
  ({ createApp }: { createApp: typeof clientIndex.createApp }) => {
    return Promise.resolve(async () => {
      // Server data that we want to be used for SSR
      // and made available on the client for hydration
      const raw = await fs.promises.readFile("assets/config.json", "utf8");
      const config = ConfigSchema.parse(JSON.parse(raw));
      // Creates main React component with all the SSR context it needs
      const main = createApp({ data: { config } });
      // Perform SSR, i.e., turn app.instance into an HTML fragment
      const element = renderToString(main);
      return {
        // Server-side rendered HTML fragment
        element,
        // The SSR context data is also passed to the template, inlined for hydration
        hydration: `<script>window.hydration = ${devalue.uneval({ data: { config } })}</script>`,
      };
    });
  };

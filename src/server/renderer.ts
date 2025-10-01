// React 18's non-streaming server-side rendering function
import { renderToString } from "react-dom/server";
import { type FastifyViteOptions } from "@fastify/vite";

import * as devalue from "devalue";
import clientIndex from "../client/index.js";
import config from "./config.js";

export const createRenderFunction: FastifyViteOptions["createRenderFunction"] =
  ({ createApp }: { createApp: typeof clientIndex.createApp }) => {
    return Promise.resolve(async () => {
      const main = createApp({ data: { config } });
      const element = renderToString(main);
      return {
        element,
        hydration: `<script>window.hydration = ${devalue.uneval({ data: { config } })}</script>`,
      };
    });
  };

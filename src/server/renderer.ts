// React 18's non-streaming server-side rendering function
import { renderToString } from "react-dom/server";
import { type FastifyViteOptions } from "@fastify/vite";

import * as devalue from "devalue";
import type { Config } from "../types.js";

export function getRenderFunction(config: Config) {
  const createRenderFunction: FastifyViteOptions["createRenderFunction"] = ({
    createApp,
  }: {
    createApp: any;
  }) => {
    return Promise.resolve(async () => {
      const main = createApp({ data: { config } });
      const element = renderToString(main);
      return {
        element,
        hydration: `<script>window.hydration = ${devalue.uneval({ data: { config } })}</script>`,
      };
    });
  };
  return createRenderFunction;
}

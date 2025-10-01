import { Suspense } from "react";
import Dash from "./components/dash";
// @ts-expect-error No types available
import { useRouteContext } from "@fastify/react/client";
import { Spinner } from "flowbite-react";
import cn from "./cn.js";
import { authClient } from "./auth.js";
import { useStore } from "@nanostores/react";
import Login from "./components/login.js";
import type { Config } from "../types.js";

export function createApp(ctx: { data: { config: Config } }, url: string) {
  return <Router config={ctx.data.config}></Router>;
}

function Router({ config }: { config: Config }) {
  const authData = useStore(authClient.useSession);
  return (
    <div
      className={cn([
        "flex",
        "justify-center",
        "items-center",
        "h-dvh",
        "dark:bg-gray-900",
        "dark:text-white",
      ])}
    >
      <Suspense fallback={<Fallback />}>
        {authData.data ? <Dash config={config} /> : <Login />}
      </Suspense>
    </div>
  );
}

function Fallback() {
  return (
    <div className={cn(["flex", "h-full", "justify-center", "items-center"])}>
      <Spinner size="xl"></Spinner>
    </div>
  );
}

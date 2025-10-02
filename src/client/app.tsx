import { Suspense, useEffect, useState } from "react";
import Dash from "./components/dash";
// @ts-expect-error No types available
import { useRouteContext } from "@fastify/react/client";
import { Spinner } from "flowbite-react";
import cn from "./cn.js";
import { authClient } from "./auth.js";
import { useStore } from "@nanostores/react";
import Login from "./components/login.js";
import type { Config } from "../types.js";
import { ErrorBoundary } from "react-error-boundary";

export function createApp(ctx: { data: { config: Config } }, url: string) {
  return <Router config={ctx.data.config}></Router>;
}

function Router({ config }: { config: Config }) {
  const authData = useStore(authClient.useSession);
  const [errors, setError] = useState<[Error, React.ErrorInfo] | undefined>(
    undefined,
  );
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
      <ErrorBoundary
        onError={(error, info) => {
          setError([error, info]);
        }}
        fallback={<ErrorFallback error={errors} />}
      >
        <Suspense fallback={<Fallback />}>
          {authData.data ? <Dash config={config} /> : <Login />}
        </Suspense>
      </ErrorBoundary>
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

function ErrorFallback({ error }: { error?: [Error, React.ErrorInfo] }) {
  if (error) {
    let [err, info] = error;
    return (
      <>
        <div className="p-5" key={err.toString()}>
          <h1 className="text-red-500 text-4xl">Error</h1>
          <h2>{err.toString()}</h2>
          <pre className="max-w-full overflow-hidden max-h-1/4">
            <code>{info.componentStack?.replaceAll(" at ", "\nat ")}</code>
          </pre>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}

import { createContext, Suspense, useState } from "react";
import Dash from "./components/dash";
import { Alert, Spinner } from "flowbite-react";
import cn from "./cn.js";
import { authClient } from "./auth.js";
import { useStore } from "@nanostores/react";
import Login from "./components/login.js";
import type { Config } from "../types.js";
import { ErrorBoundary } from "react-error-boundary";
import CodeBlock from "./components/code-block.js";
import Layout from "./components/layout.js";
import { StatusCtx, type ServerStatus } from "./status.js";
import _ from "lodash";

export const ConfigCtx = createContext<Config | null>(null);
export function createApp(ctx: { data: { config: Config } }) {
  return <Router config={ctx.data.config}></Router>;
}

function Router({ config }: { config: Config }) {
  const authData = useStore(authClient.useSession);
  const [errors, setError] = useState<[Error, React.ErrorInfo] | undefined>(
    undefined,
  );
  return (
    <ConfigCtx value={config}>
      <Layout>
        <ErrorBoundary
          onError={(error, info) => {
            setError([error, info]);
          }}
          fallback={<ErrorFallback error={errors} />}
        >
          <Suspense fallback={<Fallback />}>
            {authData.data ? <Dash /> : <Login />}
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </ConfigCtx>
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
    let text = err.toString() + "\n" + info.componentStack; //?.replaceAll(" at ", "\nat ") ?? "";
    return (
      <Alert color="failure" className="p-5 max-h-full overflow-auto">
        <h1 className="font-bold text-3xl mb-2.5">Error</h1>
        <CodeBlock language={"plaintext"} text={text}></CodeBlock>
      </Alert>
    );
  } else {
    return <></>;
  }
}

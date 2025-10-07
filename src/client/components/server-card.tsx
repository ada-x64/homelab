import { type Server } from "../../types";
import { Button, Card, Spinner } from "flowbite-react";
import _ from "lodash";
import { useContext, useState } from "react";
import ServerStats from "./server-stats";
import CodeBlock from "./code-block";
import { StatusCtx } from "../status";

export default function ServerCard({ server }: { server: Server }) {
  const allStats = useContext(StatusCtx);
  const stats = allStats[server.name];

  const [retry, setRetry] = useState<number>(0);

  let content;
  if (!stats.failed && stats.quicklook == null && stats.containers == null) {
    content = (
      <div className="flex flex-1 justify-center flex-col items-center gap-5">
        <Spinner size="lg"></Spinner>
        {server.wakeOnLan ? <WolButton server={server} /> : <></>}
      </div>
    );
  } else if (stats.failed) {
    content = (
      <>
        <div className="text-yellow-300 font-bold">Failed to fetch.</div>
        <Button
          color="alternative"
          onClick={() => {
            setRetry(retry + 1);
          }}
        >
          Retry
        </Button>
        {server.wakeOnLan ? <WolButton server={server} /> : <></>}
      </>
    );
  } else {
    content = <ServerStats server={server} stats={stats}></ServerStats>;
  }

  return (
    <Card className="flex w-full md:px-16 bg-transparent">
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-200 flex items-center gap-2">
        <img
          src="/server.svg"
          className="size-4 dark:invert dark:brightness-25"
        />
        {server.name}
      </div>
      {content}
    </Card>
  );
}

function WolButton({ server }: { server: Server }) {
  const [wolStatus, setWolStatus] = useState<{
    status: "ready" | "sending" | "failed" | "ok";
    error?: string;
  }>({ status: "ready" });

  let wolText;
  switch (wolStatus.status) {
    case "ready":
      wolText = "Send Wake-On-LAN Request";
      break;
    case "ok":
      wolText = "Sent!";
      break;
    case "failed":
      wolText = "Failed!";
      break;
    case "sending":
      wolText = <Spinner></Spinner>;
  }
  const error = wolStatus.error ? (
    <CodeBlock text={wolStatus.error} language="text"></CodeBlock>
  ) : (
    <></>
  );

  return (
    <>
      <Button
        color="alternative"
        onClick={async () => {
          try {
            setWolStatus({ status: "sending" });
            await fetch("/wake", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ server: server.name }),
            });
            setWolStatus({ status: "ok" });
            setTimeout(() => {
              setWolStatus({ status: "ready" });
            }, 2000);
          } catch (e: any) {
            setWolStatus({ status: "failed", error: e.toString() });
            setTimeout(() => {
              setWolStatus({ status: "ready" });
            }, 2000);
          }
        }}
      >
        {wolText}
      </Button>
      {error}
    </>
  );
}

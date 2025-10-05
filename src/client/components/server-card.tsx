/** @ts-ignore no types */
import {
  type Server,
  type QuickLook,
  type Uptime,
  type System,
  type Container,
} from "../../types";
import { Button, Card, Spinner } from "flowbite-react";
import _ from "lodash";
import { useContext, useEffect, useState, type Dispatch } from "react";
import ServerStats from "./server-stats";
import { ConfigCtx } from "../app";
import CodeBlock from "./code-block";

export default function ServerCard({ server }: { server: Server }) {
  const [quicklook, setQuicklook] = useState<QuickLook | null>(null);
  const [containers, setContainers] = useState<Container[] | null>(null);
  const [uptime, setUptime] = useState<Uptime | null>(null);
  const [system, setSystem] = useState<System | null>(null);
  const [failed, setFailed] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);
  const [wol, setWol] = useState<number>(0);
  const [wolStatus, setWolStatus] = useState<{
    status: "ready" | "sending" | "failed" | "ok";
    error?: string;
  }>({ status: "ready" });

  // TODO: This should be at a global level
  // so it doesn't start over at rerender.
  useEffect(() => {
    console.log("polling...");
    const maxTries = 3;
    let tries = 0;
    let interval: string | number | NodeJS.Timeout | undefined;
    const ping = async () => {
      try {
        if (!interval) {
          interval = setInterval(ping, 2000);
        }
        console.log("ping");
        setFailed(false);
        const base = `http://${server.ip}:${server.status.apiPort}${server.status.apiRoute}`;
        for (const [endpoint, setter] of [
          ["/quicklook", setQuicklook],
          ["/containers", setContainers],
          ["/uptime", setUptime],
          ["/system", setSystem],
        ]) {
          const response = await fetch(base + endpoint);
          const body = await response.json();
          (setter as Dispatch<Object>)(body);
        }
      } catch {
        tries += 1;
        if (tries > maxTries) {
          setFailed(true);
          console.info(
            `Failed to fetch stats for ${server.ip}. Clearing interval.`,
          );
          setQuicklook(null);
          setContainers(null);
          clearInterval(interval);
        }
      }
    };
    ping();
    return () => clearInterval(interval);
  }, [retry]);

  let content;
  if (!failed && quicklook == null && containers == null) {
    content = (
      <div className="flex flex-1 justify-center">
        <Spinner size="lg"></Spinner>
      </div>
    );
  } else if (failed) {
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
    const wol = server.wakeOnLan ? (
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
    ) : (
      <></>
    );
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
        {wol}
      </>
    );
  } else {
    content = (
      <ServerStats
        quicklook={quicklook!}
        containers={containers!}
        uptime={uptime!}
        system={system!}
      ></ServerStats>
    );
  }

  return (
    <Card className="flex w-full h-full md:px-16">
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-200 flex items-center gap-2">
        <img
          src="/public/server.svg"
          className="size-4 dark:invert dark:brightness-25"
        />
        {server.name}
      </div>
      {content}
    </Card>
  );
}

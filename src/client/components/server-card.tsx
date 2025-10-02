/** @ts-ignore no types */
import { type Server, type QuickLook } from "../../types";
import { Button, Card, Spinner } from "flowbite-react";
import _ from "lodash";
import { useEffect, useState } from "react";
import type { Container } from "react-dom/client";
import CodeBlock from "./code-block";

export default function ServerCard({ server }: { server: Server }) {
  const [quicklook, setQuicklook] = useState<QuickLook | null>(null);
  const [containers, setContainers] = useState<Container | null>(null);
  const [failed, setFailed] = useState<boolean>(false);
  const [retry, setRetry] = useState<number>(0);
  useEffect(() => {
    console.log("polling...");
    const maxTries = 3;
    let tries = 0;
    let interval: string | number | NodeJS.Timeout | undefined;
    const ping = async () => {
      try {
        console.log("ping");
        setFailed(false);
        const base = `http://${server.ip}:${server.status.apiPort}${server.status.apiRoute}`;
        let response = await fetch(base + "/quicklook");
        let body = await response.json();
        setQuicklook(body);
        response = await fetch(base + "/containers");
        body = await response.json();
        setContainers(body);
        if (!interval) {
          interval = setInterval(ping, 2000);
        }
      } catch {
        tries += 1;
        if (tries > maxTries) {
          setFailed(true);
          console.info(
            `Failed to fetch stats for ${server.ip}. Clearing interval.`,
          );
          clearInterval(interval);
        } else {
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
      </>
    );
  } else {
    // temp
    content = (
      <div>
        <CodeBlock
          language="json"
          className="max-h-52 overflow-auto"
          text={
            JSON.stringify(quicklook, undefined, 2) +
            "\n" +
            JSON.stringify(containers, undefined, 2)
          }
        ></CodeBlock>
      </div>
    );
  }
  return (
    <Card className="flex">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {server.name}
      </div>
      {content}
    </Card>
  );
}

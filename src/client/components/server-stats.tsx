import type { PropsWithChildren, ReactElement } from "react";
import {
  type QuickLook,
  type Container,
  type System,
  type Uptime,
  type Server,
} from "../../types";
import cn, { formatPct } from "../cn";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  HR,
} from "flowbite-react";
import CodeBlock from "./code-block";
import _ from "lodash";

export default function ServerStats({
  server,
  quicklook,
  containers,
  system,
  uptime,
}: {
  server: Server;
  quicklook: QuickLook;
  containers: Container[];
  system: System;
  uptime: Uptime;
}) {
  return (
    <Accordion>
      <AccordionPanel>
        <AccordionTitle className={cn(["text-sm", "p-2"])}>
          Server Stats
        </AccordionTitle>
        <AccordionContent className="overflow-auto max-h-48">
          <AllStats
            quicklook={quicklook}
            system={system}
            uptime={uptime}
          ></AllStats>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle className={cn(["text-sm", "p-2"])}>
          Containers
        </AccordionTitle>
        <AccordionContent className="overflow-auto max-h-48">
          <Containers server={server} values={containers}></Containers>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel>
        <AccordionTitle className={cn(["text-sm", "p-2"])}>Raw</AccordionTitle>
        <AccordionContent className="overflow-auto max-h-48">
          <CodeBlock
            language="json"
            theme={{ root: "max-h-48 p-0", block: "max-h-24 overflow-auto" }}
            text={
              JSON.stringify(quicklook, undefined, 2) +
              "\n" +
              JSON.stringify(containers, undefined, 2)
            }
          ></CodeBlock>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  );
}

function AllStats({
  quicklook,
  system,
  uptime,
}: {
  quicklook: QuickLook;
  system: System;
  uptime: Uptime;
}) {
  const cpu_usage = quicklook.percpu.map((cpu) => {
    return (
      <li
        key={quicklook.cpu_name + "-" + cpu.cpu_number}
        className="bg-black/25 flex-1"
        style={{ height: "50px" }}
      >
        <div
          className="w-full"
          style={{
            height: `${cpu.total / 2}px`,
            backgroundColor: `hsl(${(255 * cpu.cpu_number) / quicklook.percpu.length}, 75%, 50%)`,
            transform: `translateY(${(100 - cpu.total) / 2}px) scaleY(-1)`,
          }}
        ></div>
      </li>
    );
    cpu.total;
  });

  let system_svg;
  if (system?.os_name.includes("windows")) {
    system_svg = "/windows.svg";
  } else if (
    system?.os_name.includes("mac") ||
    system?.os_name.includes("apple")
  ) {
    system_svg = "/macos.svg";
  } else {
    system_svg = "/linux.svg";
  }
  const stats = [
    {
      name: "System",
      value: system?.linux_distro ?? system?.os_name,
      img: system_svg,
    },
    {
      img: "/ram.svg",
      name: "RAM",
      value: formatPct(quicklook.mem / 100),
    },
    { img: "/uptime.svg", name: "Uptime", value: uptime },
    { name: "CPU", value: quicklook.cpu_name, img: "/cpu.svg" },
  ];
  return (
    <Stats values={stats}>
      <div className={cn(["flex", "gap-1", "items-center", "text-sm"])}>
        <div className={cn(["flex-1"])}>
          <div className="size-4"></div>
          <div className="min-w-12 text-gray-500 dark:text-gray-400">
            {formatPct(quicklook.cpu / 100)}
          </div>
        </div>
        <div className={cn(["flex-3"])}>
          <ul className={cn(["flex", "gap-0.5", "max-w-64"])}>{cpu_usage}</ul>
        </div>
      </div>
    </Stats>
  );
}

function Stats({
  values,
  children,
}: PropsWithChildren & {
  values: { img: string; name: string; value: string }[];
}) {
  const stats: ReactElement[] = [];
  for (const { img, name, value } of values) {
    stats.push(
      <div
        key={name}
        className={cn(["flex", "gap-1", "items-center", "text-sm"])}
      >
        <img className={"size-4 dark:invert"} src={img}></img>
        <div
          className={cn(["flex", "w-full", "gap-1", "items-center", "text-sm"])}
        >
          <span className="font-semibold flex-1 ">{name}</span>
          <span className="flex-3 text-gray-500 dark:text-gray-400">
            {value}
          </span>
        </div>
      </div>,
    );
  }
  return (
    <div className="gap-0.5 flex flex-col">
      {stats}
      {children}
    </div>
  );
}

function Containers({
  server,
  values,
}: {
  server: Server;
  values: Container[];
}) {
  const containers = values
    ?.map((container) => {
      const stats = [
        {
          name: "Container",
          img: "/container.svg",
          value: container.name,
        },
        {
          name: "Image",
          value: container.image.toString(),
          img: "/image.svg",
        },
        {
          name: "Status",
          value: container.status,
          img: "/status.svg",
        },
        {
          name: "CPU",
          value: formatPct(container.cpu.total),
          img: "/cpu.svg",
        },
        {
          name: "RAM",
          value: formatPct(container.memory_usage / container.memory_limit),
          img: "/ram.svg",
        },
        {
          name: "Uptime",
          value: container.uptime,
          img: "/uptime.svg",
        },
      ];
      return (
        <Stats key={server.name + "-" + container.name} values={stats}></Stats>
      );
    })
    .flatMap((e) => [<HR key={e.key} className="my-2" />, e])
    .slice(1);
  return <div className="gap-0.5 flex flex-col">{containers}</div>;
}

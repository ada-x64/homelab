import cn, { convertRemToPixels as rem2Px } from "../cn";
/** @ts-ignore no types */
import { type Config } from "../../types";
import { Button, Card, Carousel, Footer, Pagination } from "flowbite-react";
import _ from "lodash";
import AppCard from "./app-card";
import ServerCard from "./server-card";
import {
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { ConfigCtx } from "../app";

export default function Dash() {
  const config = useContext(ConfigCtx)!;
  const [page, setPage] = useState(1);
  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    // page container
    <div
      className={cn([
        "h-full",
        "w-full",
        "flex",
        "flex-col",
        "justify-between",
        "items-center",
        "flex-1",
      ])}
    >
      {/* main body */}
      <div
        className={cn([
          "flex-1",
          "items-center",
          "justify-center",
          "gap-10",
          "w-full",
          "p-4",
          "lg:px-10",
          "lg:grid-cols-2",
          "lg:grid",
        ])}
      >
        <Section page={1} currentPage={page}>
          {config.apps.map((app) => (
            <AppCard
              key={crypto.randomUUID()}
              app={app}
              servers={config.servers}
              className={cn(["w-full", "lg:max-w-1/2"])}
            />
          ))}
        </Section>

        <Section page={2} currentPage={page} className={"h-full"}>
          <ServerWrapper />
        </Section>
      </div>

      {/* footer */}
      <Footer
        className="flex justify-center items-center p-4 lg:hidden"
        theme={{ root: { base: "rounded-none" } }}
      >
        <Pagination
          layout="navigation"
          currentPage={page}
          totalPages={2}
          onPageChange={onPageChange}
          nextLabel={"Stats"}
          previousLabel={"Apps"}
        />
      </Footer>
    </div>
  );
}

function Section({
  page,
  currentPage,
  children,
  className,
}: PropsWithChildren & {
  page: number;
  currentPage: number;
  className?: string;
}) {
  return (
    <div
      className={cn([
        className ?? "",
        currentPage == page ? "flex" : "hidden",
        "flex-1",
        "flex-col",
        "justify-center",
        "items-center",
        "gap-5",
        "lg:flex",
        `lg:col-${page}`,
        "lg:w-full",
      ])}
    >
      {children}
    </div>
  );
}

function ServerWrapper() {
  const config = useContext(ConfigCtx);
  const [serverPage, setServerPage] = useState(1);
  const onChangeServerPage = (page: number) => {
    setServerPage(page);
  };

  const serverCards = config!.servers.map((server) => (
    <ServerCard key={crypto.randomUUID()} server={server} />
  ));
  return (
    <div className={cn(["w-full", "flex", "flex-col"])}>
      {serverCards[serverPage - 1]}
      <Pagination
        className={"self-center"}
        totalPages={serverCards.length}
        currentPage={serverPage}
        onPageChange={onChangeServerPage}
      ></Pagination>
    </div>
  );
}

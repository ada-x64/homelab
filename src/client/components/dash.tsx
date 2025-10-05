import cn, { convertRemToPixels as rem2Px } from "../cn";
/** @ts-ignore no types */
import { type Config } from "../../types";
import { Button, Card, Carousel, Footer, Pagination } from "flowbite-react";
import _ from "lodash";
import AppCard from "./app-card";
import ServerCard from "./server-card";
import { useContext, useLayoutEffect, useState } from "react";
import { ConfigCtx } from "../app";

export default function Dash() {
  const config = useContext(ConfigCtx)!;
  const [page, setPage] = useState(1);
  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div
      className={cn([
        "h-full",
        "flex",
        "flex-col",
        "justify-between",
        "items-center",
        "flex-1",
      ])}
    >
      <div className="flex flex-1 items-center justify-center gap-10">
        <div
          className={cn([
            "m-auto",
            page == 1 ? "flex" : "hidden",
            "lg:min-w-md",
            "max-w-fit",
            "grow-0",
            "self-center",
            "gap-5",
            "lg:flex",
            "flex-col",
            "flex-1",
          ])}
        >
          {config.apps.map((app) => (
            <AppCard
              key={crypto.randomUUID()}
              app={app}
              servers={config.servers}
            />
          ))}
        </div>
        <div
          className={cn([
            page == 2 ? "flex" : "hidden",
            "lg:flex",
            "justify-center",
            "items-center",
            "flex-col",
            "m-4",
            "max-h-3/4",
            "max-w-3/4",
            "lg:max-w-1/2",
            "flex-1",
          ])}
        >
          <Carousel
            pauseOnHover
            theme={{
              control: {
                base: "bg-black/30 group-hover:bg-black/50 dark:bg-white/30 dark:group-hover:bg-white/50",
              },
              indicators: {
                active: {
                  off: "bg-black/50 hover:bg-black/75 dark:bg-white/50 dark:hover:bg-white/75",
                  on: "bg-black dark:bg-white",
                },
              },
            }}
          >
            {config.servers.map((server) => (
              <ServerCard key={crypto.randomUUID()} server={server} />
            ))}
          </Carousel>
        </div>
      </div>
      <Footer
        className="flex justify-center p-4 lg:hidden"
        theme={{ root: { base: "rounded-none" } }}
      >
        <Pagination
          className="flex-1"
          layout="navigation"
          currentPage={page}
          totalPages={2}
          onPageChange={onPageChange}
          showIcons
          nextLabel={"Stats"}
          previousLabel={"Apps"}
        />
      </Footer>
    </div>
  );
}

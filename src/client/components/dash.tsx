import cn from "../cn";
/** @ts-ignore no types */
import { type Config } from "../../types";
import { Card, DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import _ from "lodash";
import AppCard from "./app-card";
import ServerCard from "./server-card";
import { authClient } from "../auth";

export default function Dash({ config }: { config: Config }) {
  const signOut = async () => {
    await authClient.signOut();
  };
  return (
    <main className="flex flex-col h-full w-full">
      <Navbar>
        <NavbarBrand>
          <img
            src="/public/brand.svg"
            className="mr-3 h-6 sm:h-9 dark:invert"
            alt="homelab"
          ></img>
          <span className="self-center whitespace no-wrap text-xl font-semibod dark:text-white">
            homelab
          </span>
        </NavbarBrand>
        <div className="flex gap-2 md:order-2 items-center">
          <a
            href="#"
            onClick={signOut}
            className="dark:text-gray-400 text-gray-500 text-sm hover:underline"
          >
            sign out
          </a>
          <DarkThemeToggle />
        </div>
      </Navbar>
      <div
        className={cn([
          "grid",
          "grid-cols-2",
          "gap-10",
          "m-5",
          "justify-around",
        ])}
      >
        <div className="flex flex-col justify-center h-full">
          <Card
            className={cn(["min-w-md", "max-w-fit", "grow-0", "self-center"])}
          >
            {config.apps.map((app) => (
              <AppCard
                key={crypto.randomUUID()}
                app={app}
                servers={config.servers}
              />
            ))}
          </Card>
        </div>
        <div className="flex flex-col justify-center">
          <Card className="max-h-fit flex-1">
            {config.servers.map((server) => (
              <ServerCard key={crypto.randomUUID()} server={server} />
            ))}
          </Card>
        </div>
      </div>
    </main>
  );
}

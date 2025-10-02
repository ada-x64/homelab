import cn from "../cn";
/** @ts-ignore no types */
import { type Config } from "../../types";
import {
  Card,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import _ from "lodash";
import AppCard from "./app-card";
import ServerCard from "./server-card";

export default function Dash({ config }: { config: Config }) {
  const signOut = () => {};
  return (
    <main className="flex flex-col h-full w-full">
      <Navbar fluid rounded>
        <NavbarBrand></NavbarBrand>
        <NavbarToggle></NavbarToggle>
        <NavbarCollapse>
          <NavbarLink href="#" onClick={signOut}>
            Sign Out
          </NavbarLink>
        </NavbarCollapse>
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

import ReactDOM from "react-dom/client";
import { createApp } from "./app";
import { initThemeMode } from "flowbite-react";
import type { Config } from "../types";

declare global {
  interface Window {
    hydration: { data: { config: Config } };
  }
}

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  createApp(window.hydration, window.location.href),
);

// TODO: Reincorporate this.
initThemeMode();

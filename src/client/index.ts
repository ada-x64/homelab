import { Component } from "react";
import { createApp } from "./app.tsx";
import Login from "./components/login.tsx";
export default {
  createApp,
  routes: [{ path: "/", component: Login }],
};

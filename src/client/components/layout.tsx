import Navbar from "./navbar";
import { type PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col w-full h-lvh overflow-hidden">
        {children}
      </main>
    </>
  );
}

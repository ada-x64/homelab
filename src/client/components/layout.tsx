import Navbar from "./navbar";
import { type PropsWithChildren } from "react";

export default function ({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center">
        {children}
      </main>
    </>
  );
}

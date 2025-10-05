import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";
import { authClient } from "../auth";

export default function () {
  const signOut = async () => {
    await authClient.signOut();
  };
  return (
    <Navbar className="absolute top-0 w-full">
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
  );
}

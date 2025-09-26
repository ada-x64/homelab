import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

// TODO: Passkey auth
export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
});

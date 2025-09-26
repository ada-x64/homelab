import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import dotenv from "dotenv";
dotenv.config();

// TODO: Passkey auth
export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

auth.api
  .signUpEmail({
    body: {
      name: "admin",
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PW!,
    },
  })
  .then((res) => {
    console.log("[\x1b[36mINFO\x1b[0m] Successfully signed up admin!");
    console.log(
      "[\x1b[36mINFO\x1b[0m] For best security, please restart the server WITHOUT the ADMIN_EMAIL and ADMIN_PW environment variables.",
    );
  })
  .catch(() => {
    if (process.env.ADMIN_EMAIL || process.env.ADMIN_PW) {
      console.warn(
        "[\x1b[33m WARN \x1b[0m] ADMIN_EMAIL and ADMIN_PW found in environment after registration.",
      );
      console.warn(
        "[\x1b[33m WARN \x1b[0m] For maximum security, remove these values.",
      );
    }
  });

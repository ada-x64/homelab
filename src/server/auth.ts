import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import dotenv from "dotenv";
dotenv.config();

export const database = new Database("./sqlite.db");
database.pragma("journal_mode = WAL");

// TODO: Passkey auth
export const auth = betterAuth({
  database,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

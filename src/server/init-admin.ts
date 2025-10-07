import type { FastifyPluginCallback } from "fastify";
import { auth, database } from "./auth.js";
import fs from "fs";

const init: FastifyPluginCallback = async (server) => {
  // wait for db to be available
  let checkCount = 0;
  await new Promise<void>((resolve, reject) => {
    let inner = () => {
      checkCount++;
      fs.access("./sqlite.db", fs.constants.R_OK, (err) => {
        if (!err) {
          resolve();
        } else {
          if (checkCount > 10) {
            server.log.error("Could not read database!");
            reject();
          }
          setTimeout(inner, 100);
        }
      });
    };
    setTimeout(inner, 100);
  });

  try {
    const admins = database.prepare("SELECT * FROM user").all();
    if (admins.length > 1) {
      server.log.warn("Multiple accounts found in the database!");
      server.log.warn(
        "If this is unintentional, please delete sqlite.db and reconfigure.",
      );
    }
    if (
      admins.length > 0 &&
      (process.env.ADMIN_USERNAME || process.env.ADMIN_PW)
    ) {
      server.log.warn(
        "ADMIN_USERNAME and/or ADMIN_PW found in environment even though admin has already been registered.",
      );
      server.log.warn("Refusing to add new administrative account.");
      server.log.warn(
        "If you would like to reset your configuration, please delete sqlite.db and try again.",
      );
      return;
    }
  } catch {
    server.log.info("Creating administror account.");
    const init = fs.readFileSync("migrations/init.sql", "utf8");
    database.exec(init);
  }
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PW) {
    auth.api
      .signUpEmail({
        body: {
          name: "admin",
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PW,
        },
      })
      .then((_res) => {
        server.log.info("Successfully signed up admin!");
        server.log.warn(
          "For best security, please restart the server WITHOUT the ADMIN_EMAIL and ADMIN_PW environment variables.",
        );
      })
      .catch((e) => {
        server.log.error("Failed to sign up admin!");
        server.log.error(e);
      });
  }
};

export default init;

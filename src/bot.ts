import "source-map-support/register";
import dotenv from "dotenv";
import { DndClient } from "./customClasses/dndclient.class";
import { createDatabase } from "./database";
import { logger } from "./utils/logger";

async function main(): Promise<void> {
  dotenv.config();

  const client = new DndClient(
    {
      akairoOptions: {
        ownerID: "255482941876994059",
      },
    },
    {
      db: await createDatabase({
        connectionConfig: {
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
        },
      }),
      rootdir: __dirname,
    }
  );
  logger.info("Beginning login process.");
  await client.login(process.env.TOKEN);
}

main();

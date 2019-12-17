import "source-map-support/register";
import dotenv from "dotenv";
import { DndClient } from "./customClasses/dndclient.class";
import { createDatabase } from "./database";

process.on("uncaughtException", (error) => console.log(error));

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

  await client.login(process.env.TOKEN);
}

main();

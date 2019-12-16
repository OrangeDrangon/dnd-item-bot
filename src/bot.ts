import "source-map-support/register";
import dotenv from "dotenv";
import { Client } from "./client.class";
import { createDatabase } from "./database";

async function main(): Promise<void> {
  dotenv.config();

  process.on("uncaughtException", (error) => console.log(error));

  const client = new Client(
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
    }
  );

  await client.login(process.env.TOKEN);
}

main();

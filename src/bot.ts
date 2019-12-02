import { SQLiteProvider } from "discord.js-commando";
import "source-map-support/register";
import sqlite from "sqlite";
import path from "path";
import dotenv from "dotenv";
import { Client } from "./util/client";
import { createDatabase } from "./database/database";

async function main(): Promise<void> {
  dotenv.config();

  process.on("uncaughtException", (error) => console.log(error));

  const client = new Client(
    await createDatabase({
      connectionConfig: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
      },
    }),
    {
      owner: "255482941876994059",
    }
  );

  const sqlitedb = await sqlite.open(path.join(__dirname, "settings.sqlite3"));
  client.setProvider(new SQLiteProvider(sqlitedb));

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ["configuration", "Configuration"],
      ["items", "Item Managment"],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, "commands"));

  client.on("ready", async () => {
    if (client.user != null) {
      client.user.setActivity("D&D", { type: "PLAYING" });
      console.log("Bot is now running...");
      const inviteLink = await client.generateInvite([
        "MANAGE_CHANNELS",
        "MANAGE_EMOJIS",
        "MANAGE_MESSAGES",
      ]);
      console.log("Invite link: " + inviteLink);
    }
  });

  await client.login(process.env.TOKEN);
}

main();

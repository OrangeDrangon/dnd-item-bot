import { SQLiteProvider } from "discord.js-commando";
import "source-map-support/register";
import sqlite from "sqlite";
import path from "path";
import dotenv from "dotenv";
import { createDb } from "./util/db";
import { Client } from "./util/client";

async function main(): Promise<void> {
  dotenv.config();

  const client = new Client(await createDb(), {
    owner: "255482941876994059",
  });

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

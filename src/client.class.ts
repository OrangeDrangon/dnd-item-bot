import {
  AkairoClient,
  AkairoOptions,
  CommandHandler,
  // InhibitorHandler,
  ListenerHandler,
} from "discord-akairo";
import { Database } from "./database";
import { ClientOptions } from "discord.js";
import path from "path";

declare module "discord-akairo" {
  interface AkairoClient {
    db: Database;
  }
}

export class Client extends AkairoClient {
  public commandHandler: CommandHandler;
  // public inhibitorHandler: InhibitorHandler;
  public listenerHandler: ListenerHandler;
  public db: Database;
  constructor(
    {
      akairoOptions,
      discordJsOptions,
    }: {
      akairoOptions?: AkairoOptions;
      discordJsOptions?: ClientOptions;
    },
    { db }: { db: Database }
  ) {
    super(akairoOptions, discordJsOptions);

    this.db = db;

    this.commandHandler = new CommandHandler(this, {
      directory: path.join(__dirname, "commands"),
      prefix: "!",
      commandUtil: true,
      handleEdits: true,
    });

    // this.inhibitorHandler = new InhibitorHandler(this, {
    //   directory: "./inhibitors",
    // });

    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(__dirname, "listeners"),
    });

    this.commandHandler.loadAll();
    // this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}

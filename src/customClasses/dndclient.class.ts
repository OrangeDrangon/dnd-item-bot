import {
  AkairoClient,
  AkairoOptions,
  CommandHandler,
  // InhibitorHandler,
  ListenerHandler,
} from "discord-akairo";
import { Database } from "../database";
import { ClientOptions } from "discord.js";
import path from "path";

declare module "discord-akairo" {
  interface AkairoClient {
    db: Database;
  }
}

export class DndClient extends AkairoClient {
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
    { db, rootdir }: { db: Database; rootdir: string }
  ) {
    super(akairoOptions, discordJsOptions);

    this.db = db;

    this.commandHandler = new CommandHandler(this, {
      directory: path.join(rootdir, "commands"),
      prefix: "!",
      commandUtil: true,
      handleEdits: true,
    });

    // this.inhibitorHandler = new InhibitorHandler(this, {
    //   directory: "./inhibitors",
    // });

    this.listenerHandler = new ListenerHandler(this, {
      directory: path.join(rootdir, "listeners"),
    });

    this.commandHandler.loadAll();
    // this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}

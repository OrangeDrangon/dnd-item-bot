import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
import { Database } from "../types/database.types";

export class Client extends CommandoClient {
  public db: Database;
  constructor(db: Database, options: CommandoClientOptions) {
    super(options);
    this.db = db;
  }
}

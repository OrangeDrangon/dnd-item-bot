import { CommandoClient, CommandoClientOptions } from "discord.js-commando";
import { Database } from "../database/database";

export class Client extends CommandoClient {
  public db: Database;
  constructor(db: Database, options: CommandoClientOptions) {
    super(options);
    this.db = db;
  }
}

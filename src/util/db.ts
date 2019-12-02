import { Guild, Db, Database } from "../types/database.types";
import FileAsync from "lowdb/adapters/FileAsync";
import Lowdb from "lowdb";
import path from "path";

export async function createDb(): Promise<Database> {
  const db = await Lowdb(
    new FileAsync<Db>(path.join(__dirname, "database.json"), {
      defaultValue: { guilds: [] },
    })
  );

  return {
    addGuild: async (guild: Guild): Promise<void> => {
      await db
        .get("guilds")
        .push(guild)
        .write();
    },
    getGuild: async (id: string): Promise<Guild> => {
      return db
        .get("guilds")
        .filter({ id })
        .first()
        .value();
    },
    removeGuild: async (id: string): Promise<void> => {
      await db
        .get("guilds")
        .remove({ id })
        .write();
    },
    updateCurrency: async (id: string, value: number): Promise<void> => {
      await db
        .get("guilds")
        .find({ id })
        .set("channel.copper", value)
        .write();
    },
  };
}

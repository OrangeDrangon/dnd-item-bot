import { IGuild, IDb } from "./types/database.types";
import FileAsync from "lowdb/adapters/FileAsync";
import Lowdb from "lowdb";
import path from "path";

export async function createDb() {
  const db = await Lowdb(
    new FileAsync<IDb>(path.join(__dirname, "database.json"), {
      defaultValue: { guilds: [] }
    })
  );

  return {
    addGuild: async (guild: IGuild): Promise<void> => {
      await db
        .get("guilds")
        .push(guild)
        .write();
    },
    getGuild: async (id: string): Promise<IGuild> => {
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
    }
  };
}

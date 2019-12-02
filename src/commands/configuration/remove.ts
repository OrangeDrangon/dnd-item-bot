import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../util/client";
import { Database } from "../../types/database.types";
import { Message } from "discord.js";

module.exports = class RemoveCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "remove",
      aliases: ["r"],
      group: "configuration",
      memberName: "remove",
      description:
        "Removes the items channel from the database and the server.",
      guildOnly: true,
      userPermissions: ["MANAGE_CHANNELS"],
    });
    this.db = client.db;
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const { guild } = message;
    const guildEntry = await this.db.getGuild(guild.id);
    if (guildEntry == null) {
      return await message.say(
        "Items channel does not exist there is nothing to remove!"
      );
    }
    const toRemove = guild.channels.find((c) => c.id === guildEntry.channel.id);
    if (toRemove) {
      await toRemove.delete();
    }
    await this.db.removeGuild(guild.id);
    try {
      return await message.say("Removed!");
    } catch (error) {
      return await message.author.send("Removed!");
    }
  }
};

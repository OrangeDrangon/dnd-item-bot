import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../util/client";
import { Message } from "discord.js";
import { Database } from "../../database/database";

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
    const guildEntries = await this.db.getWallets({ guildId: guild.id });
    if (guildEntries.length === 0) {
      return await message.say(
        "Items channel does not exist there is nothing to remove!"
      );
    }
    const toRemove = guild.channels.find(
      (c) => c.id === guildEntries[0].channelId
    );
    if (toRemove) {
      await toRemove.delete();
    }
    await this.db.removeWallet({ guildId: guild.id });
    try {
      return await message.say("Removed!");
    } catch (error) {
      return await message.author.send("Removed!");
    }
  }
};

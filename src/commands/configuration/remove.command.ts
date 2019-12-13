import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "util/client";
import { Message } from "discord.js";
import { Database } from "database";

export default class RemoveCommand extends Command {
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
      clientPermissions: ["MANAGE_CHANNELS"],
      args: [
        {
          key: "name",
          prompt:
            "Name of the wallet to remove. This is the same as the channel name.",
          type: "string",
        },
      ],
    });
    this.db = client.db;
  }

  async run(
    message: CommandoMessage,
    { name }: { name: string }
  ): Promise<Message | Message[]> {
    const { guild } = message;
    const guildEntries = await this.db.getWallets({ guildId: guild.id, name });
    if (guildEntries.length === 0) {
      return await message.say(
        "Channel does not exist there is nothing to remove!"
      );
    }
    const toRemove = guild.channels.find(
      (c) => c.id === guildEntries[0].channelId
    );
    if (toRemove) {
      await toRemove.delete();
    }
    await this.db.removeWallet({ guildId: guild.id, name });
    try {
      return await message.say("Removed!");
    } catch (error) {
      return await message.author.send("Removed!");
    }
  }
}

import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../util/client";
import { Message } from "discord.js";
import { Database } from "../../database/database";

export default class CleanCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "clean",
      memberName: "clean",
      group: "configuration",
      description:
        "Removes all messages besides the wallet message from the channel",
      guildOnly: true,
    });
    this.db = client.db;
  }

  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const { channel, guild } = message;
    const blacklistedMessages = new Set(
      (
        await this.db.getWallets({
          guildId: guild.id,
          channelId: channel.id,
        })
      ).map((wallet) => wallet.messageId)
    );
    if (blacklistedMessages.size === 0) {
      return await message.say("This is not a wallet channel!");
    }
    return (
      await channel.bulkDelete(
        (await channel.messages.fetch()).filter(
          (msg) => !blacklistedMessages.has(msg.id)
        )
      )
    ).array();
  }
}

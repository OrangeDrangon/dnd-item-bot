import { Message } from "discord.js";
import { DndCommand } from "../../dndcommand.class";

export default class CleanCommand extends DndCommand {
  constructor() {
    super("clean", {
      aliases: ["clean"],
      category: "config",
      description:
        "Removes all messages besides the wallet message from the channel",
      channel: "guild",
      editable: true,
      ratelimit: 2,
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
    });
  }

  async exec(message: Message): Promise<Message | Message[]> {
    const { channel, guild, util } = message;

    if (util == null) {
      throw new Error("Util object is undefined.");
    }

    if (guild == null) {
      throw new Error("Guild object is undefined.");
    }

    const blacklistedMessages = new Set(
      (
        await this.client.db.getWallets({
          guildId: guild.id,
          channelId: channel.id,
        })
      ).map((wallet) => wallet.messageId)
    );

    if (blacklistedMessages.size === 0) {
      return await util.reply("This is not a wallet channel!");
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

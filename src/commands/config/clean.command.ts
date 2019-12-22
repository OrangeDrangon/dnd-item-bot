import { Message } from "discord.js";
import { DndCommand } from "../../customClasses/dndcommand.class";
import { logger } from "../../utils/logger";
import { TextChannel } from "discord.js";

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
    const { guild, util } = message;
    const channel = message.channel as TextChannel;

    if (util == null) {
      logger.error("Util object is undefined.");
      return await message.author.send(
        "Internal error you should not see this."
      );
    }

    if (guild == null) {
      logger.error("Guild object is undefined.");
      return await message.author.send(
        "Internal error you should not see this."
      );
    }

    logger.info(
      `Fetching wallet messageIds for the ${channel.name}:${channel.id} channel in ${guild.name}:${guild.id}`
    );
    const blacklistedMessages = (
      await this.client.db.getWallets({
        guildId: guild.id,
        channelId: channel.id,
      })
    ).map((wallet) => wallet.messageId);

    if (blacklistedMessages.length === 0) {
      logger.warn(
        `Did not find any wallets in the ${channel.name}:${channel.id} channel in ${guild.name}:${guild.id}`
      );
      return await util.reply("This is not a wallet channel!");
    }

    logger.info(
      `Deleting the last 100 messages in ${channel.name}:${channel.id} channel in ${guild.name}:${guild.id}`
    );
    return (
      await channel.bulkDelete(
        (await channel.messages.fetch()).filter(
          (msg) => !blacklistedMessages.includes(msg.id)
        )
      )
    ).array();
  }
}

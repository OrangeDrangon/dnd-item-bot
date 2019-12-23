import { TextChannel, Message } from "discord.js";
import { Wallet } from "../interfaces/wallet";
import { createCurrencyEmbed } from "./createCurrencyEmbed";
import { Currency } from "../interfaces/currency";
import { Database } from "../database";
import { Guild } from "discord.js";
import { logger } from "./logger";

export async function editMessage(
  guild: Guild,
  channel: TextChannel,
  wallet: Wallet,
  currency: Currency,
  db: Database,
  description?: string
): Promise<Message> {
  try {
    logger.info(
      `Attempting to edit the currency message for ${channel.name}:${channel.id} ${guild.name}:${guild.id}`
    );
    logger.info(`Fetching message: ${wallet.messageId}`);
    const embedMessage = await channel.messages.fetch(wallet.messageId);
    if (embedMessage.embeds.length === 0) {
      await embedMessage.delete();
      throw new Error("Embed missing.");
    }
    logger.info("Editing message.");
    return await embedMessage.edit(
      await createCurrencyEmbed(guild, currency, description)
    );
  } catch (error) {
    logger.error(error);
    logger.info("Attempting to resend the currency message.");
    const messageNew = await channel.send(
      await createCurrencyEmbed(guild, currency, description)
    );
    wallet.messageId = messageNew.id;
    logger.info("Updating database with the new messageId.");
    await db.updateWallet(wallet);
    return messageNew;
  }
}

import { TextChannel, Message, DMChannel } from "discord.js";
import { Wallet } from "../interfaces/wallet";
import { createCurrencyEmbed } from "./createCurrencyEmbed";
import { Currency } from "../interfaces/currency";
import { Database } from "../database";
import { Guild } from "discord.js";

export async function editMessage(
  guild: Guild,
  channel: TextChannel | DMChannel,
  wallet: Wallet,
  currency: Currency,
  db: Database,
  description?: string
): Promise<Message | Message[]> {
  try {
    const embedMessage = await channel.messages.fetch(wallet.messageId);
    if (embedMessage.embeds.length === 0) {
      await embedMessage.delete();
      throw new Error("Embed missing.");
    }

    return await embedMessage.edit(
      await createCurrencyEmbed(guild, currency, description)
    );
  } catch (error) {
    const messageNew = await channel.send(
      await createCurrencyEmbed(guild, currency, description)
    );
    wallet.messageId = messageNew.id;
    await db.updateWallet(wallet);
    return messageNew;
  }
}
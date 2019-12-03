import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../util/client";
import { Message } from "discord.js";
import { Database } from "../../database/database";
import { getCurrencyName } from "../../util/getCurrencyName";
import { createCurrencyEmbed } from "../../util/createCurrencyEmbed";
import { Currency } from "../../interfaces/currency";

interface Args {
  variation:
    | "platinum"
    | "gold"
    | "electrum"
    | "silver"
    | "copper"
    | "p"
    | "g"
    | "e"
    | "s"
    | "c";
  count: number;
}

module.exports = class CurrencyCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "currency",
      aliases: ["c"],
      group: "items",
      memberName: "currency",
      description: "Manipulates currency.",
      args: [
        {
          key: "variation",
          prompt:
            "Type of the thing to add. <platinum | gold | electrum | silver | copper>.",
          type: "string",
          validate: (text: string): boolean =>
            [
              "platinum",
              "gold",
              "electrum",
              "silver",
              "copper",
              "p",
              "g",
              "e",
              "s",
              "c",
            ].includes(text.toLowerCase()),
        },
        {
          key: "count",
          prompt: "Number to add or subtract",
          type: "integer",
        },
      ],
    });
    this.db = client.db;
  }

  async run(
    message: CommandoMessage,
    { variation, count }: Args
  ): Promise<Message | Message[]> {
    const { guild, channel } = message;
    const wallets = await this.db.getWallets({
      guildId: guild.id,
      channelId: channel.id,
    });
    if (wallets.length === 0) {
      return await message.say(
        "Not in a wallet channel please run this command again in one."
      );
    }
    let wallet = wallets[0];
    const currencyName = getCurrencyName(variation);
    wallet[currencyName] += count;
    wallet = await this.db.updateWallet(wallet);
    const currency: Currency = {
      platinum: wallet.platinum,
      gold: wallet.gold,
      electrum: wallet.electrum,
      silver: wallet.silver,
      copper: wallet.copper,
    };
    await message.delete();
    try {
      const embedMessage = await channel.messages.fetch(wallet.messageId);
      return await embedMessage.edit(
        await createCurrencyEmbed(guild, currency)
      );
    } catch (error) {
      const messageNew = await channel.send(
        await createCurrencyEmbed(guild, currency)
      );
      wallet.messageId = messageNew.id;
      await this.db.updateWallet(wallet);
      return messageNew;
    }
  }
};

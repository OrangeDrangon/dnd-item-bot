import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../util/client";
import { Database } from "../../database/database";
import { Message } from "discord.js";
import { Currency } from "../../interfaces/currency";
import { createCurrencyEmbed } from "../../util/createCurrencyEmbed";
import { editMessage } from "../../util/editMessage";

export default class DivideCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "divide",
      aliases: ["d", "div", "split"],
      description:
        "This command calculates how much currency each person gets if it were to be divided.",
      memberName: "divide",
      group: "items",
      guildOnly: true,
      args: [
        {
          key: "divisor",
          type: "integer",
          default: 2,
          prompt: "The amount of groups to divide into.",
        },
      ],
    });
    this.db = client.db;
  }

  async run(
    message: CommandoMessage,
    { divisor }: { divisor: number }
  ): Promise<Message | Message[]> {
    const { guild, channel } = message;
    const walletEntries = await this.db.getWallets({
      guildId: guild.id,
      channelId: channel.id,
    });
    if (walletEntries.length == 0) {
      return await message.say("No wallet in this channel.");
    }

    const wallet = walletEntries[0];
    const currencyDivided: Currency = {
      platinum: Math.floor(wallet.platinum / divisor),
      gold: Math.floor(wallet.gold / divisor),
      electrum: Math.floor(wallet.electrum / divisor),
      silver: Math.floor(wallet.silver / divisor),
      copper: Math.floor(wallet.copper / divisor),
    };
    const remainderCurrency: Currency = {
      platinum: wallet.platinum % divisor,
      gold: wallet.gold % divisor,
      electrum: wallet.electrum % divisor,
      silver: wallet.silver % divisor,
      copper: wallet.copper % divisor,
    };
    await editMessage(guild, channel, wallet, remainderCurrency, this.db);
    for (const key in remainderCurrency) {
      (wallet as any)[key] = (remainderCurrency as any)[key];
    }
    await this.db.updateWallet(wallet);
    return await message.say(
      await createCurrencyEmbed(
        guild,
        currencyDivided,
        "Here is the divided currency for all of the members."
      )
    );
  }
}

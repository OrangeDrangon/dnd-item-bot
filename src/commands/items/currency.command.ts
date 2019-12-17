import { Message } from "discord.js";
import { getCurrencyName } from "../../utils/getCurrencyName";
import { Currency } from "../../interfaces/currency";
import { editMessage } from "../../utils/editMessage";
import { DndCommand } from "../../dndcommand.class";
import { createPromptFunction } from "../../utils/createPromptFunction";

const currencyOptions = ["p", "g", "e", "s", "c"];

const currencyPromptString = currencyOptions.join(" | ");

interface Args {
  variation: "p" | "g" | "e" | "s" | "c";
  count: number;
}

export default class CurrencyCommand extends DndCommand {
  constructor() {
    super("currency", {
      aliases: ["currency", "c"],
      category: "items",
      description: "Manipulates the amount of currency.",
      channel: "guild",
      args: [
        {
          id: "variation",
          description:
            "Type of the thing to add. <platinum | gold | electrum | silver | copper>.",
          type: currencyOptions,
          prompt: {
            start: createPromptFunction(
              `Please enter the variation of currency you would like to modify. <${currencyPromptString}>`
            ),
            retry: createPromptFunction(
              `Invalid type of currency. Please enter a valid option <${currencyPromptString}>`
            ),
          },
        },
        {
          id: "count",
          description: "Number to add or subtract",
          type: "integer",
          prompt: {
            start: createPromptFunction(
              "Please enter an integer for the amount of currency you would like to add or subtract."
            ),
            retry: createPromptFunction(
              "Invalid integer. Please enter an integer for the amount of currency you would like to add or subtract."
            ),
          },
        },
      ],
    });
  }

  async exec(message: Message, { variation, count }: Args): Promise<Message> {
    const { guild, util, channel } = message;

    if (util == null) {
      throw new Error("Util object is undefined");
    }

    if (guild == null) {
      throw new Error("Guild object is undefined.");
    }

    const wallets = await this.client.db.getWallets({
      guildId: guild.id,
      channelId: channel.id,
    });

    if (wallets.length === 0) {
      return await util.reply(
        "Not in a wallet channel please run this command again in a channel with one."
      );
    }
    let wallet = wallets[0];
    const currencyName = getCurrencyName(variation);

    wallet[currencyName] += count;
    wallet = await this.client.db.updateWallet(wallet);

    const currency: Currency = {
      platinum: wallet.platinum,
      gold: wallet.gold,
      electrum: wallet.electrum,
      silver: wallet.silver,
      copper: wallet.copper,
    };

    await message.delete();
    return await editMessage(guild, channel, wallet, currency, this.client.db);
  }
}

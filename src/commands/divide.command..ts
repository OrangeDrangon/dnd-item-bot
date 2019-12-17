import { Message } from "discord.js";
import { Currency } from "../interfaces/currency";
import { createCurrencyEmbed } from "../utils/createCurrencyEmbed";
import { editMessage } from "../utils/editMessage";
import { DndCommand } from "../dndcommand.class";
import { createPromptFunction } from "../utils/createPromptFunction";

export default class DivideCommand extends DndCommand {
  constructor() {
    super("divide", {
      aliases: ["divide", "d", "div", "split"],
      description:
        "This command calculates how much currency each person gets if it were to be divided.",
      category: "items",
      channel: "guild",
      args: [
        {
          id: "divisor",
          type: "integer",
          default: 2,
          prompt: {
            start: createPromptFunction(
              "The amount of groups to divide into as an integer."
            ),
            retry: createPromptFunction(
              "Invalid integer. Please enter the amount of groups to divide into as an integer."
            ),
            optional: true,
          },
        },
      ],
    });
  }

  async exec(
    message: Message,
    { divisor }: { divisor: number }
  ): Promise<Message> {
    const { guild, util, channel } = message;

    if (guild == null) {
      throw new Error("Guild object is undefiend.");
    }

    if (util == null) {
      throw new Error("Util object is undefined.");
    }

    const walletEntries = await this.client.db.getWallets({
      guildId: guild.id,
      channelId: channel.id,
    });

    if (walletEntries.length == 0) {
      return await util.reply("No wallet in this channel.");
    }

    let wallet = walletEntries[0];

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

    await editMessage(
      guild,
      channel,
      wallet,
      remainderCurrency,
      this.client.db
    );

    wallet = { ...wallet, ...remainderCurrency };

    await this.client.db.updateWallet(wallet);
    return await util.reply(
      await createCurrencyEmbed(
        guild,
        currencyDivided,
        "Here is the divided currency for all of the members."
      )
    );
  }
}

import { Command, CommandoMessage } from "discord.js-commando";
import { Client } from "../../client";
import { Database } from "../../types/database.types";
import { TextChannel, MessageEmbed, Message } from "discord.js";
import { createCurrencyEmbed } from "../../createCurrencyEmbed";
import { convertCurrencyStorage } from "../../convertCurrency";

interface IArgs {
  variation: "platinum" | "gold" | "electrum" | "silver" | "copper";
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
          validate: (text: string) =>
            ["platinum", "gold", "electrum", "silver", "copper"].includes(
              text.toLowerCase()
            )
              ? true
              : false
        },
        {
          key: "count",
          prompt: "Number to add or subtract",
          type: "integer"
        }
      ]
    });
    this.db = client.db;
  }

  async run(
    message: CommandoMessage,
    { variation, count }: IArgs
  ): Promise<Message | Message[]> {
    const { guild } = message;
    const guildEntry = await this.db.getGuild(guild.id);
    if (message.channel.id === guildEntry.channel.id) {
      guildEntry.channel.copper += convertCurrencyStorage(variation, count);
      const embedMessage = await message.channel.messages.fetch(
        guildEntry.channel.currencyMessageId
      );
      await embedMessage.edit(
        await createCurrencyEmbed(guild, guildEntry.channel.copper)
      );
      await this.db.updateCurrency(guildEntry.id, guildEntry.channel.copper);
      return await message.delete();
    }
    return await message.say("Error modifying currency.");
  }
};

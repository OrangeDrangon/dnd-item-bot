import { MessageEmbed, Guild } from "discord.js";
import { getEmojis } from "./getEmojis";
import { Currency } from "../interfaces/currency";
import { logger } from "./logger";

export async function createCurrencyEmbed(
  guild: Guild,
  currency: Currency,
  description?: string
): Promise<MessageEmbed> {
  const emojis = await getEmojis(guild, [
    {
      name: "platinum",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/platinum.png",
    },
    {
      name: "gold",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/gold.png",
    },
    {
      name: "electrum",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/electrum.png",
    },
    {
      name: "silver",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/silver.png",
    },
    {
      name: "copper",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/copper.png",
    },
  ]);

  logger.info(`Creating currency embed for ${guild.name}:${guild.id}`);

  return new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Coin")
    .setDescription(description || "The amount of coin the party has acquired.")
    .addField(`${emojis[0]}<-Platinum->${emojis[0]}`, currency.platinum, true)
    .addField(`${emojis[1]}<-Gold->${emojis[1]}`, currency.gold, true)
    .addField(`${emojis[2]}<-Electrum->${emojis[2]}`, currency.electrum, true)
    .addField(`${emojis[3]}<-Silver->${emojis[3]}`, currency.silver, true)
    .addField(`${emojis[4]}<-Copper->${emojis[4]}`, currency.copper, true)
    .setFooter(
      "Created by Drangon#6334",
      "https://cdn.discordapp.com/avatars/255482941876994059/0a525588185d1f03b9eb548b59981abb.png?size=128"
    )
    .setTimestamp();
}

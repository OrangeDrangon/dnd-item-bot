import { MessageEmbed, Guild } from "discord.js";
import { convertCurrencyDisplay } from "./convertCurrency";
import { getEmojis } from "./getEmojis";

export async function createCurrencyEmbed(guild: Guild, copperCount: number) {
  const emojis = await getEmojis(guild, [
    {
      name: "platinum",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/platinum.png"
    },
    {
      name: "gold",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/gold.png"
    },
    {
      name: "electrum",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/electrum.png"
    },
    {
      name: "silver",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/silver.png"
    },
    {
      name: "copper",
      fallbackUrl:
        "https://raw.githubusercontent.com/OrangeDrangon/dnd-item-bot/6b516b8d829996bfd80d014b447a6654a9879fe4/coin_images/copper.png"
    }
  ]);

  const currency = convertCurrencyDisplay(copperCount);

  return new MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Assets")
    .setDescription(
      "The amount of generic non useful assets the party has acquired."
    )
    .addField(`${emojis[0]}<-Platinum->${emojis[0]}`, currency.platinum)
    .addField(`${emojis[1]}<-Gold->${emojis[1]}`, currency.gold)
    .addField(`${emojis[2]}<-Silver->${emojis[2]}`, currency.silver)
    .addField(`${emojis[3]}<-Copper->${emojis[3]}`, currency.copper)
    .setFooter(
      "Created by Drangon#6334",
      "https://cdn.discordapp.com/avatars/255482941876994059/0a525588185d1f03b9eb548b59981abb.png?size=128"
    )
    .setTimestamp();
}

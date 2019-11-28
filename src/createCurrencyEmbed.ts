import { MessageEmbed, Guild } from "discord.js";
import { convertCurrencyDisplay } from "./convertCurrency";
import { getEmojis } from "./getEmojis";

export async function createCurrencyEmbed(guild: Guild, copperCount: number) {
  const emojis = await getEmojis(guild, [
    { name: "platinum", fallbackUrl: "" },
    { name: "gold", fallbackUrl: "" },
    { name: "electrum", fallbackUrl: "" },
    { name: "silver", fallbackUrl: "" },
    { name: "copper", fallbackUrl: "" }
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

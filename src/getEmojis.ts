import { Guild, GuildEmoji } from "discord.js";

export async function getEmoji(
  guild: Guild,
  name: string,
  fallbackUrl?: string
) {
  let emoji = guild.emojis.find(e => e.name === name);
  if (emoji == null && fallbackUrl) {
    try {
      emoji = await guild.emojis.create(fallbackUrl, name);
      return emoji;
    } catch (error) {}
  } else {
    return emoji;
  }
  return;
}

interface IEmoji {
  name: string;
  fallbackUrl?: string;
}

export async function getEmojis(guild: Guild, emojis: IEmoji[]) {
  return await Promise.all(emojis.map(e => getEmoji(guild, e.name, e.fallbackUrl)));
}

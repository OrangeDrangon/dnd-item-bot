import { Guild, GuildEmoji } from "discord.js";

interface Emoji {
  name: string;
  fallbackUrl?: string;
}

export async function getEmoji(
  guild: Guild,
  { name, fallbackUrl }: Emoji
): Promise<GuildEmoji | undefined> {
  let emoji = guild.emojis.find(({ name: emojiName }) => emojiName === name);
  if (emoji == null && fallbackUrl) {
    try {
      emoji = await guild.emojis.create(fallbackUrl, name);
      return emoji;
    } catch (error) {
      return;
    }
  } else {
    return emoji;
  }
}

export async function getEmojis(
  guild: Guild,
  emojis: Emoji[]
): Promise<(GuildEmoji | undefined)[]> {
  return await Promise.all(
    emojis.map(({ name, fallbackUrl }) =>
      getEmoji(guild, { name, fallbackUrl })
    )
  );
}

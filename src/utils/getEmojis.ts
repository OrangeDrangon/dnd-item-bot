import { Guild, GuildEmoji } from "discord.js";
import { logger } from "./logger";

interface Emoji {
  name: string;
  fallbackUrl?: string;
}

export async function getEmoji(
  guild: Guild,
  { name, fallbackUrl }: Emoji
): Promise<GuildEmoji | undefined> {
  logger.info(`Fetching ${name} emoji for the ${guild.name}:${guild.id}.`);
  let emoji = guild.emojis.find(({ name: emojiName }) => emojiName === name);
  if (emoji == null && fallbackUrl) {
    try {
      logger.info(
        `Attempting to create the ${name} emoji from the fallback url: ${fallbackUrl}`
      );
      emoji = await guild.emojis.create(fallbackUrl, name);
      logger.info(
        `Successfully created ${name}:${emoji.id} emoji for ${guild.name}:${guild.id}`
      );
    } catch (error) {
      logger.error(error);
      return;
    }
  }
  logger.info(`${name}:${emoji?.id} emoji found for ${guild.name}:${guild.id}`);
  return emoji;
}

export async function getEmojis(
  guild: Guild,
  emojis: Emoji[]
): Promise<(GuildEmoji | undefined)[]> {
  logger.info(
    `Loading array of emojis: [${emojis
      .map((emoji) => emoji.name)
      .join(", ")}] for ${guild.name}:${guild.id}`
  );
  return await Promise.all(
    emojis.map(({ name, fallbackUrl }) =>
      getEmoji(guild, { name, fallbackUrl })
    )
  );
}

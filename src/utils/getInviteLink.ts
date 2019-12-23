import { AkairoClient } from "discord-akairo";
import { logger } from "./logger";

export async function getInviteLink(client: AkairoClient): Promise<string> {
  logger.info("Generating invite link.");
  return await client.generateInvite([
    "MANAGE_CHANNELS",
    "MANAGE_EMOJIS",
    "MANAGE_MESSAGES",
  ]);
}

import { AkairoClient } from "discord-akairo";

export async function getInviteLink(client: AkairoClient): Promise<string> {
  return await client.generateInvite([
    "MANAGE_CHANNELS",
    "MANAGE_EMOJIS",
    "MANAGE_MESSAGES",
  ]);
}

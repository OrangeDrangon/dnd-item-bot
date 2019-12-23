import { Listener } from "discord-akairo";
import { getInviteLink } from "../utils/getInviteLink";
import { logger } from "../utils/logger";

export default class ReadyListener extends Listener {
  constructor() {
    super("ready", { emitter: "client", event: "ready" });
  }

  async exec(): Promise<void> {
    logger.info("Bot is ready.");
    logger.info("Setting presence.");
    await this.client.user?.setActivity("D&D", { type: "PLAYING" });
    logger.info(`Invite link: ${await getInviteLink(this.client)}`);
  }
}

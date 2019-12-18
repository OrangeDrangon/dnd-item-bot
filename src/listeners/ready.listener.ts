import { Listener } from "discord-akairo";
import { getInviteLink } from "../utils/getInviteLink";

export default class ReadyListener extends Listener {
  constructor() {
    super("ready", { emitter: "client", event: "ready" });
  }

  async exec(): Promise<void> {
    await this.client.user?.setActivity("D&D", { type: "PLAYING" });
    console.log("Bot is running...");
    console.log("Invite link:", await getInviteLink(this.client));
  }
}

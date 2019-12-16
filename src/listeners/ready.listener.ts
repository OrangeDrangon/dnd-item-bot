import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  constructor() {
    super("ready", { emitter: "client", event: "ready" });
  }

  async exec(): Promise<void> {
    const inviteLink = await this.client.generateInvite([
      "MANAGE_CHANNELS",
      "MANAGE_EMOJIS",
      "MANAGE_MESSAGES",
    ]);
    await this.client.user?.setActivity("D&D", { type: "PLAYING" });
    console.log("Bot is running...");
    console.log("Invite link:", inviteLink);
  }
}

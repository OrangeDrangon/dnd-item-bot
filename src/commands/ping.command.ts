import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      editable: true,
      description: "Ping... pong.",
    });
  }

  async exec(message: Message): Promise<Message> {
    const { util } = message;
    if (util != null) {
      return await util.reply("Pong!");
    } else {
      throw new Error("Util object is undefined.");
    }
  }
}

import { Message } from "discord.js";
import { DndCommand } from "../command.class";

export default class PingCommand extends DndCommand {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      editable: true,
      description: "Ping... pong.",
      category: "utility",
      typing: true,
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

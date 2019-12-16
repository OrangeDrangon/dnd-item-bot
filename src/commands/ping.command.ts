import { Message } from "discord.js";
import { DndCommand } from "../dndcommand.class";

export default class PingCommand extends DndCommand {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      editable: true,
      description: "Ping... pong.",
      category: "utility",
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

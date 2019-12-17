import { DndCommand } from "../../dndcommand.class";
import { Message } from "discord.js";

export default class GithubCommand extends DndCommand {
  constructor() {
    super("github", {
      aliases: ["github"],
      description: ["Returns the link to the github page for the bot project."],
      category: "utility",
    });
  }

  async exec(message: Message): Promise<Message> {
    const { util } = message;
    if (util == null) {
      throw new Error("Util object is undefined.");
    }
    return await util.reply(
      process.env.GITHUB_URL || "Not set for this project."
    );
  }
}

import { DndCommand } from "../../customClasses/dndcommand.class";
import { Message } from "discord.js";
import { getInviteLink } from "../../utils/getInviteLink";

export default class InviteLinkCommand extends DndCommand {
  constructor() {
    super("invite", {
      aliases: ["invite", "inv"],
      description: "Returns the invite link for the bot.",
      editable: true,
      category: "utility",
    });
  }

  async exec(message: Message): Promise<Message> {
    const { util } = message;

    if (util == null) {
      throw new Error("Util object is undefined");
    }

    return await util.reply(await getInviteLink(this.client));
  }
}

import { Message } from "discord.js";
import { DndCommand } from "../../customClasses/dndcommand.class";
import { TextChannel } from "discord.js";
import { createPromptFunction } from "../../utils/createPromptFunction";

export default class RemoveCommand extends DndCommand {
  constructor() {
    super("remove", {
      aliases: ["remove", "r"],
      category: "config",
      description:
        "Removes the items channel from the database and the server.",
      channel: "guild",
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      args: [
        {
          id: "channel",
          description:
            "Mention the channel with the #<name> syntax in order to remove the respective channel and wallet.",
          type: "channelMention",
          prompt: {
            start: createPromptFunction(
              "Please reply with a valid channel mention."
            ),
            retry: createPromptFunction(
              "That is not a valid channel mention. Please try again and use the #<channel> syntax provided by Discord."
            ),
          },
        },
      ],
    });
  }

  async exec(
    message: Message,
    { channel }: { channel: TextChannel }
  ): Promise<Message | undefined> {
    const { guild, util } = message;

    if (guild == null) {
      throw new Error("Guild object is undefiend.");
    }

    if (util == null) {
      throw new Error("Util object is undefined.");
    }

    const guildEntries = await this.client.db.getWallets({
      guildId: guild.id,
      channelId: channel.id,
    });

    if (guildEntries.length === 0) {
      return await util.reply("No wallet found with that name.");
    }

    await this.client.db.removeWallet({
      guildId: guild.id,
      channelId: channel.id,
    });

    const toRemove = guild.channels.resolve(channel.id);

    if (toRemove == null) {
      return await util.reply(
        "Channel does not exist. There is nothing to remove!"
      );
    }

    await toRemove.delete(`${message.author} ran the remove command.`);
    return;
  }
}

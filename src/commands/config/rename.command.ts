import { Message } from "discord.js";
import { DndCommand } from "../../customClasses/dndcommand.class";
import { createPromptFunction } from "../../utils/createPromptFunction";

export default class RenameCommand extends DndCommand {
  constructor() {
    super("rename", {
      aliases: ["rename"],
      category: "config",
      description: "Renames the wallet and channel",
      channel: "guild",
      args: [
        {
          id: "name",
          description: "New name for the channel,",
          type: "string",
          prompt: {
            start: createPromptFunction(
              "Please respond with the new name for the wallet and channel."
            ),
            retry: createPromptFunction(
              "That was not a valid string please try again."
            ),
          },
        },
      ],
    });
  }

  async exec(message: Message, { name }: { name: string }): Promise<Message> {
    const { guild, util, channel } = message;

    if (guild == null) {
      throw new Error("Guild object is undefiend.");
    }

    if (util == null) {
      throw new Error("Util object is undefined.");
    }

    const walletEntries = await this.client.db.getWallets({
      guildId: guild.id,
      name,
    });

    if (walletEntries.length > 0) {
      return await util.reply("Name already in use on this server");
    }

    const wallet = (
      await this.client.db.getWallets({
        guildId: guild.id,
        channelId: channel.id,
      })
    )[0];

    const guildChannel = guild.channels.resolve(channel.id);

    if (guildChannel == null) {
      return await util.reply("Channel not found? This should not happen.");
    }

    wallet.name = name;
    await guildChannel.setName(name, `Rename command by ${message.author}`);
    await this.client.db.updateWallet(wallet);

    return await message.delete();
  }
}

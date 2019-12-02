import { Command, CommandoMessage } from "discord.js-commando";
import { Database } from "../../database/database";
import { Client } from "../../util/client";
import { Message } from "discord.js";

module.exports = class RenameCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "rename",
      aliases: ["r"],
      group: "configuration",
      description: "Renames the wallet and channel",
      memberName: "rename",
      args: [
        {
          key: "name",
          prompt: "New name for the channel",
          type: "string",
          parse: (arg: string): string => arg.replace(/ /g, "-"),
          validate: (arg: string): boolean => arg.length > 3,
        },
      ],
    });
    this.db = client.db;
  }

  async run(
    message: CommandoMessage,
    { name }: { name: string }
  ): Promise<Message | Message[]> {
    const { guild, channel } = message;
    const walletEntries = await this.db.getWallets({
      guildId: guild.id,
      name,
    });
    if (walletEntries.length > 0) {
      return await message.say("Name already in use on this server");
    }
    const wallet = (
      await this.db.getWallets({
        guildId: guild.id,
        channelId: channel.id,
      })
    )[0];
    const guildChannel = guild.channels.find((c) => c.id === channel.id);
    if (guildChannel != null) {
      wallet.name = name;
      await guildChannel.setName(name, `Rename command by ${message.author}`);
      await this.db.updateWallet(wallet);
    }
    return await message.say(`Rename command. ${name}`);
  }
};

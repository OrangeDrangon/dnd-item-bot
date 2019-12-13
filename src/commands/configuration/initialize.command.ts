import { Command, CommandoMessage } from "discord.js-commando";
import { Message, TextChannel } from "discord.js";
import { Client } from "util/client";
import { createCurrencyEmbed } from "util/createCurrencyEmbed";
import { Database } from "database";

export default class InitializeCommand extends Command {
  private db: Database;
  constructor(client: Client) {
    super(client, {
      name: "initialize",
      aliases: ["init", "i"],
      group: "configuration",
      memberName: "initialize",
      description: "Initializes this channel for item management purposes",
      guildOnly: true,
      userPermissions: ["MANAGE_CHANNELS", "MANAGE_EMOJIS"],
      clientPermissions: ["MANAGE_CHANNELS", "MANAGE_EMOJIS"],
      args: [
        {
          key: "name",
          prompt: "The name of the channel and wallet to be created.",
          type: "string",
          default: "default",
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
    const { guild } = message;
    const walletEntries = await this.db.getWallets({
      guildId: guild.id,
      name,
    });

    let channel: TextChannel | undefined = undefined;
    if (walletEntries.length === 0) {
      let parentId;
      if (message.channel instanceof TextChannel) {
        parentId = message.channel.parentID;
      }
      channel = (await guild.channels.create(name, {
        type: "text",
        parent: parentId ? parentId.toString() : undefined,
      })) as TextChannel;
    } else {
      return await message.say("Items channel already exists!");
    }

    if (channel != null) {
      const defaultCurrency = {
        platinum: 0,
        gold: 0,
        electrum: 0,
        silver: 0,
        copper: 0,
      };

      const currencyMessage = await channel.send(
        await createCurrencyEmbed(guild, defaultCurrency)
      );

      const isDefault = walletEntries.length === 0;

      this.db.addWallet({
        guildId: guild.id,
        channelId: channel.id,
        messageId: currencyMessage.id,
        isDefault,
        name,
      });

      return await message.say(`Your new ${channel} channel has been created!`);
    } else {
      return await message.say("Error creating new channel!");
    }
  }
}

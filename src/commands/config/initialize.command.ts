import { Message, TextChannel } from "discord.js";
import { createCurrencyEmbed } from "../../utils/createCurrencyEmbed";
import { DndCommand } from "../../customClasses/dndcommand.class";
import { createPromptFunction } from "../../utils/createPromptFunction";

export default class InitializeCommand extends DndCommand {
  constructor() {
    super("initialize", {
      aliases: ["initialize", "init", "i"],
      description: "Initializes this channel for item management purposes",
      category: "config",
      userPermissions: ["MANAGE_CHANNELS", "MANAGE_EMOJIS"],
      clientPermissions: ["MANAGE_CHANNELS", "MANAGE_EMOJIS"],
      channel: "guild",
      args: [
        {
          id: "name",
          description:
            "The name of the channel and wallet to be created. It can be dash seperated.",
          type: "string",
          default: "default",
          prompt: {
            start: createPromptFunction("Please respond with a valid string."),
            retry: createPromptFunction(
              "That was not a valid argument. Please respoond with a valid string."
            ),
            optional: true,
          },
        },
      ],
    });
  }
  async exec(message: Message, { name }: { name: string }): Promise<Message> {
    const { guild, util } = message;

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
      return await util.reply(`${name} channel already exists!`);
    }

    const parentId = (message.channel as TextChannel).parentID;
    const channel = await guild.channels.create(name, {
      type: "text",
      parent: parentId != null ? parentId : undefined,
    });

    if (channel == null) {
      return await util.reply("Error creating new channel!");
    }

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

    // remanant for if I change to a multi wallet per channel method
    const isDefault = walletEntries.length === 0;
    await this.client.db.addWallet({
      guildId: guild.id,
      channelId: channel.id,
      messageId: currencyMessage.id,
      isDefault,
      name,
    });

    return await util.reply(`Your new ${channel} channel has been created!`);
  }
}

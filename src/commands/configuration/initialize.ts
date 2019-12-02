import { Command, CommandoMessage } from "discord.js-commando";
import { Message, TextChannel } from "discord.js";
import { Database, Guild } from "../../types/database.types";
import { Client } from "../../client";
import { createCurrencyEmbed } from "../../createCurrencyEmbed";

module.exports = class InitializeCommand extends Command {
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
    });
    this.db = client.db;
  }
  async run(message: CommandoMessage): Promise<Message | Message[]> {
    const { guild } = message;
    const guildEntry = await this.db.getGuild(message.guild.id);

    let channel: TextChannel | undefined = undefined;
    if (guildEntry == null) {
      let parentId;
      if (message.channel instanceof TextChannel) {
        parentId = message.channel.parentID;
      }
      channel = (await guild.channels.create("items", {
        type: "text",
        parent: parentId ? parentId.toString() : undefined,
        topic: "Item tracking channel for the game!",
      })) as TextChannel;
    } else {
      return await message.say("Items channel already exists!");
    }

    if (channel != null) {
      const currencyMessage = (await channel.send(
        await createCurrencyEmbed(guild, 0)
      )) as Message;

      const dbEntry: Guild = {
        id: guild.id,
        channel: {
          id: channel.id,
          currencyMessageId: currencyMessage.id,
          itemsMessageId: "",
          copper: 0,
          items: [],
        },
      };

      await this.db.addGuild(dbEntry);
      return await message.say(`Your new ${channel} channel has been created!`);
    } else {
      return await message.say("Error creating new channel!");
    }
  }
};

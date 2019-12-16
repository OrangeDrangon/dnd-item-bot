import { Category, Command, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { DndCommand } from "../command.class";
import { Collection } from "discord.js";

interface CommandData {
  prefix: string | string[] | PrefixSupplier;
  shortUseage: string;
  useage: string;
  args: Collection<string, { useage: string; description: string }>;
}

export default class HelpCommand extends DndCommand {
  constructor() {
    super("help", {
      aliases: ["help", "h"],
      description:
        "Get a list of catagories, commands, or details about a specific command.",
      editable: true,
      category: "utility",
      typing: true,
      args: [
        {
          id: "selector",
          type: "string",
          match: "content",
          default: null,
          description: "Category or command to retrieve.",
        },
      ],
    });
  }

  private getCommandData(command: Command): CommandData {
    const prefix = command.prefix || this.handler.prefix;
    const shortUseage = `${prefix}${command.id}`;
    const args = new Collection<
      string,
      { useage: string; description: string }
    >();
    command.args?.forEach((arg) => {
      arg.id != null
        ? args.set(arg.id, {
            useage: `(${arg.id}${arg.default !== undefined ? "?" : ""}: ${
              arg.type
            })`,
            description: arg.description,
          })
        : null;
    });

    return {
      prefix,
      shortUseage,
      useage: `${shortUseage} ${args.map((arg) => arg.useage).join(" ")}`,
      args,
    };
  }

  private getCatagoryList(
    catagories: Collection<string, Category<string, Command>>
  ): MessageEmbed {
    let embed = new MessageEmbed()
      .setTitle("Catagories")
      .setTimestamp()
      .setColor("RANDOM");

    catagories.forEach((category, key) => {
      const commands = category.map(
        (command) => this.getCommandData(command).shortUseage
      );
      embed = embed.addField(key.toUpperCase(), commands.join("\n"), true);
    });

    return embed;
  }

  private getCommandList(
    selector: string,
    category: Category<string, Command>
  ): MessageEmbed {
    let embed = new MessageEmbed()
      .setTitle(selector.toUpperCase())
      .setTimestamp()
      .setColor("RANDOM");

    category.forEach((command) => {
      const { useage, shortUseage } = this.getCommandData(command);
      embed = embed.addField(
        useage.length <= 256 ? useage : shortUseage,
        command.description,
        true
      );
    });
    return embed;
  }

  private getCommand(command: Command): MessageEmbed {
    const { shortUseage, args } = this.getCommandData(command);
    let embed = new MessageEmbed()
      .setTitle(shortUseage)
      .setDescription(command.description)
      .addField("Aliases", command.aliases.join(", "))
      .setTimestamp()
      .setColor("RANDOM");

    args.forEach((arg) => {
      embed = embed.addField(arg.useage, arg.description, true);
    });

    return embed;
  }

  async exec(
    message: Message,
    args: { selector: string | null }
  ): Promise<Message> {
    const { util } = message;
    if (util) {
      const selector = args.selector?.toLowerCase();
      if (selector == null) {
        return await util.reply(this.getCatagoryList(this.handler.categories));
      }
      const category = this.handler.categories.get(selector);
      if (category != null) {
        return await util.reply(this.getCommandList(selector, category));
      }
      const command = this.handler.modules.get(selector);
      if (command != null) {
        return await util.reply(this.getCommand(command));
      }
      return await util.reply("Category or command not found with that name.");
    } else {
      throw new Error("Util object is undefined.");
    }
  }
}

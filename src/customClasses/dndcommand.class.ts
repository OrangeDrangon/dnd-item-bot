import { Message } from "discord.js";

import {
  Command as AkairoCommand,
  CommandOptions,
  ArgumentOptions,
} from "discord-akairo";

declare module "discord-akairo" {
  interface Command {
    args?: ArgumentOptions[];
  }
}

interface DndArgumentOptions extends ArgumentOptions {
  id: string;
  description: string;
}

interface DndCommandOptions extends CommandOptions {
  aliases: string[];
  description: string;
  category: string;
  args?: DndArgumentOptions[];
}

export abstract class DndCommand extends AkairoCommand {
  public args: ArgumentOptions[] | undefined;
  constructor(identifier: string, options?: DndCommandOptions) {
    super(identifier, options);
    this.args = options?.args;
  }

  abstract async exec(
    message: Message,
    args?: unknown
  ): Promise<Message | Message[]>;
}

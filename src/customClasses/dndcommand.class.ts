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

export class DndCommand extends AkairoCommand {
  public args: ArgumentOptions[] | undefined;
  constructor(identifier: string, options?: CommandOptions) {
    super(identifier, options);
    if (
      options?.args != null &&
      (options?.args as ArgumentOptions[])[0] != null
    ) {
      this.args = options?.args as ArgumentOptions[];
    }
  }
}

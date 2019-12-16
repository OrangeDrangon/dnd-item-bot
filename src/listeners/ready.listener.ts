import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  constructor() {
    super("ready", { emitter: "client", event: "ready" });
  }

  async exec(...args: any[]): Promise<void> {
    console.log(args);
  }
}

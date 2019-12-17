import { Message } from "discord.js";

export function createPromptFunction(
  text: string
): (message: Message) => string {
  return (message: Message): string => `${message.author}, ${text}`;
}

import { join } from "path";

export function getPath(...path: string[]): string {
  return join(__dirname, "..", ...path);
}

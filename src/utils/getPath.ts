import { rootDir } from "../bot";
import {join} from "path";

export function getPath(...path: string[]): string {
  return join(rootDir, ...path);
}

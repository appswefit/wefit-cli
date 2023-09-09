import { execSync } from "node:child_process";
import { type } from "node:os";
import { TEXTS } from "../constants";
import { getText } from "./getTexts";

export const getClipboard = (args: string[] = []) => {
  try {
    if (args.length === 0) {
      throw new Error(TEXTS.invalid.remoteUrl);
    }

    const command = args.join(" ");
    const isWindows = type() === "Windows_NT";
    const echo = `echo "${command}"`;
    const copy = `${isWindows ? "clip" : "pbcopy"}`;
    execSync(`${echo} | ${copy}`);
    console.log(getText.clipboard(command));
  } catch (error) {
    throw new Error(TEXTS.invalid.execution);
  }
};

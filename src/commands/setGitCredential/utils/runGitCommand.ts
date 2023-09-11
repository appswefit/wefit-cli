import { spawnSync } from "node:child_process";
import { TEXTS } from "../constants";

export const runGitCommand = (args: string[], options = {}) => {
  const { error, stdout, stderr } = spawnSync("git", args, options);
  if (error || stderr) {
    const command = `"git ${args.join(" ")}".${TEXTS.breakLine}`;
    const firstLine = `${TEXTS.error.execute} ${command}`;
    const message = `${firstLine}${TEXTS.error.call}${
      error?.message ?? stderr
    }`;
    throw new Error(message);
  }

  return stdout.toString().trim();
};

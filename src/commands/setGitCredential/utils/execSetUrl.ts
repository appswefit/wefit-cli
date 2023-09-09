import { SpawnSyncOptionsWithStringEncoding } from "node:child_process";
import { TEXTS } from "../constants";
import { runGitCommand } from "./runGitCommand";

interface ExecSetUrlProps {
  args: string[];
  options: SpawnSyncOptionsWithStringEncoding;
}

export const execSetUrl = ({ args = [], options }: ExecSetUrlProps) => {
  try {
    if (args?.length === 0) {
      throw new Error(TEXTS.invalid.remoteUrl);
    }

    runGitCommand(args, options);
    console.log(TEXTS.success);
  } catch (error) {
    throw new Error(TEXTS.invalid.execution);
  }
};

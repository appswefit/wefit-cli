import { SpawnSyncOptionsWithStringEncoding } from "node:child_process";
import { BREAK_LINE, GIT_COMMANDS, TEXTS } from "../constants";
import { runGitCommand } from "./runGitCommand";

// Obtenha a saída do comando "git remote -v"
export const getFirstLineFromGitRemoteOutput = (
  options: SpawnSyncOptionsWithStringEncoding
) => {
  const gitRemoteResult = runGitCommand(GIT_COMMANDS.remote, options);
  if (!gitRemoteResult) {
    throw new Error(TEXTS.error.verifyRemote);
  }

  const output = gitRemoteResult.trim();
  const [firstLine] = output.split(BREAK_LINE);
  return firstLine;
};

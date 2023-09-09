import { SpawnSyncOptionsWithStringEncoding } from "node:child_process";
import { GIT_COMMANDS, TEXTS } from "../constants";
import { runGitCommand } from "./runGitCommand";

// Verifique se a pasta existe como repositório git
export const checkGitRepositoryExistence = (
  options: SpawnSyncOptionsWithStringEncoding
) => {
  const gitStatusResult = runGitCommand(GIT_COMMANDS.status, options);
  if (!gitStatusResult) {
    throw new Error(TEXTS.invalid.gitStatus);
  }
};

import { execSync } from "node:child_process";
import { TEXTS } from "../constants";

export const getClipboard = (command = "") => {
  if (!command) {
    console.log(TEXTS.invalidExecution);
    return;
  }

  const echo = `echo "${command}" | pbcopy`;
  execSync(echo);
  console.log(TEXTS.clipboard(command));
};

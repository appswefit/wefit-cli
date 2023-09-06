import { execSync } from "node:child_process";
import { TEXTS } from "../constants";

interface ExecGitRemoteProps {
  command: string;
  path: string;
}

export const execGitRemote = ({ command, path }: ExecGitRemoteProps) => {
  if (!command) {
    console.log(TEXTS.invalidExecution);
    return;
  }

  const cd = `cd ${path}`;
  execSync(`${cd} && ${command}`, { encoding: "utf-8" });
  console.log(TEXTS.success);
};

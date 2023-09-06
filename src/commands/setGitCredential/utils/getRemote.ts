import { execSync } from "node:child_process";
import { REGEX, TEXTS } from "../constants";

interface GetRemoteProps {
  credential: string;
  folderPath: string;
}

export const getRemote = ({ credential, folderPath }: GetRemoteProps) => {
  const remoteCommand = TEXTS.remoteCommand(folderPath);
  const remoteUrl = execSync(remoteCommand, { encoding: "utf-8" }).trim();

  if (!remoteUrl) {
    console.log(TEXTS.invalidRemoteUrl(folderPath));
    return "";
  }

  return remoteUrl.replace(REGEX.remote, `$1:${credential}@$3`);
};

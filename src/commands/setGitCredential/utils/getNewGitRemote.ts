import { resolve } from "node:path";
import { TEXTS } from "../constants";
import { checkGitRepositoryExistence } from "./checkGitRepositoryExistence";
import { getFirstLineFromGitRemoteOutput } from "./getFirstLineFromGitRemoteOutput";
import { getRemoteUrlFromLine } from "./getRemoteUrlFromLine";
import { getSpawnOptions } from "./getSpawnOptions";
import { getText } from "./getTexts";
import { validateCredentialFromRemoteUrl } from "./validateCredentialFromRemoteUrl";

interface UpdateGitRemoteProps {
  credential: string;
  folderPath: string;
}

export const getNewGitRemote = ({
  credential,
  folderPath,
}: UpdateGitRemoteProps) => {
  try {
    const resolvedPath = resolve(folderPath);
    const options = getSpawnOptions(resolvedPath);

    checkGitRepositoryExistence(options);

    const firstLine = getFirstLineFromGitRemoteOutput(options);
    const remoteUrl = getRemoteUrlFromLine(firstLine);

    // Substitua a credencial na URL remota
    const { prefix, suffix } = validateCredentialFromRemoteUrl(remoteUrl);
    const newRemoteUrl = `${prefix}:${credential}@${suffix}`;

    console.log(getText.insert(credential, folderPath));
    return { newRemoteUrl, options };
  } catch (error: any) {
    const errorText = `[getNewGitRemote] - ${TEXTS.error.reason}`;
    throw new Error(error?.message ?? errorText);
  }
};

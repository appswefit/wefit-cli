import { GIT_COMMANDS, MIN_LENGTH_CREDENTIAL, TEXTS } from "./constants";
import { ChoiceEnum } from "./interface";
import {
  execSetUrl,
  getClipboard,
  getNewGitRemote,
  getText,
  validateChoice,
  validatePath,
} from "./utils";

export default async function setGitRemoteCredential(credential: string) {
  if (!credential) {
    console.log(TEXTS.invalid.credential);
    console.log(TEXTS.example.long);
    console.log(TEXTS.example.short);
    return;
  }

  const size = credential.length;
  if (size < MIN_LENGTH_CREDENTIAL) {
    console.log(getText.invalid.length(size));
    return;
  }

  console.log(TEXTS.welcome);

  const { folderExists, folderPath } = await validatePath();
  if (!folderExists) {
    console.log(getText.error.path(folderPath));
    return;
  }

  try {
    const { newRemoteUrl, options } = getNewGitRemote({
      credential,
      folderPath,
    });
    const args = [...GIT_COMMANDS.setUrl, newRemoteUrl];
    const choice = await validateChoice();
    if (choice === ChoiceEnum.ONE) {
      execSetUrl({ args, options });
      return;
    }

    if (choice === ChoiceEnum.TWO) {
      getClipboard(args);
      return;
    }

    console.log(TEXTS.error.reason);
  } catch (error: any) {
    const errorText = `[setGitRemoteCredential] - ${TEXTS.error.reason}`;
    console.log(error?.message ?? errorText);
  }
}

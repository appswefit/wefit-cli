import { MIN_LENGTH_CREDENTIAL, TEXTS } from "./constants";
import { ChoiceEnum } from "./interface";
import {
  execGitRemote,
  getClipboard,
  getRemote,
  validateChoice,
  validatePath,
} from "./utils";

export default async function setGitRemoteCredential(credential: string) {
  if (!credential) {
    console.log(TEXTS.invalid);
    console.log(TEXTS.example);
    console.log(TEXTS.exampleShort);
    return;
  }

  const size = credential.length;
  if (size < MIN_LENGTH_CREDENTIAL) {
    console.log(TEXTS.invalidLength(size));
    return;
  }

  console.log(TEXTS.welcome);

  const { folderExists, folderPath } = await validatePath();
  if (!folderExists) {
    console.log(TEXTS.invalidPath(folderPath));
    return;
  }

  console.log(TEXTS.insert(credential, folderPath));

  const preparedRemote = getRemote({ credential, folderPath });
  if (!preparedRemote) {
    return;
  }

  const command = TEXTS.command(preparedRemote);
  const choice = await validateChoice();
  if (choice === ChoiceEnum.ONE) {
    execGitRemote({ command, path: folderPath });
    return;
  }

  if (choice === ChoiceEnum.TWO) {
    getClipboard(command);
    return;
  }

  console.log(TEXTS.invalidReason);
}

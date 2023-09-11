import { existsSync } from "node:fs";
import { resolve } from "node:path";

import promptUser from "../../../utils/promptUser";
import { getHomeDir } from "./getHomeDir";
import { getText } from "./getTexts";

export const validatePath = async () => {
  const currentDir = process.cwd();
  const userPath = await promptUser(getText.prompt.path(currentDir));

  const chosenPath = userPath || currentDir;
  const prepareChosen = chosenPath.replace(/^~/gim, getHomeDir());
  const folderPath = resolve(prepareChosen);
  const folderExists = existsSync(folderPath);

  return { folderExists, folderPath };
};

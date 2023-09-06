import { existsSync } from "node:fs";
import { resolve } from "node:path";

import promptUser from "../../../utils/promptUser";
import { TEXTS } from "../constants";
import { getHomeDir } from "./getHomeDir";

export const validatePath = async () => {
  const currentDir = process.cwd();
  const userPath = await promptUser(TEXTS.promptPath(currentDir));

  const chosenPath = userPath || currentDir;
  const prepareChosen = chosenPath.replace(/^~/gim, getHomeDir());
  const folderPath = resolve(prepareChosen);
  const folderExists = existsSync(folderPath);

  return { folderExists, folderPath };
};

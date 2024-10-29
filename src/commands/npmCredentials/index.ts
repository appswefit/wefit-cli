import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { ArgumentsCamelCase } from "yargs";

import promptUser from "../../utils/promptUser";
import { getHomeDir, getText } from "../setGitCredential/utils";
import { MESSAGES_NPM_CREDENTIALS } from "./constants";
import { createOrUpdateNpmrc, FabricEnum, validateChoice, type BaseProps } from "./utils";

/**
 * Comando para criar um arquivo `npmrc` com credenciais.
 *
 * @param {ArgumentsCamelCase<BaseProps>} options - Opções do comando.
 * @returns {Promise<void>} Promessa que resolve quando o comando é executado com sucesso.
 */
export default async function npmCredentials({ email, password }: ArgumentsCamelCase<BaseProps>) {
  const currentDir = process.cwd();
  const userPath = await promptUser(MESSAGES_NPM_CREDENTIALS.prompt.getRepositoryPathPrompt(currentDir));
  const chosenPath = userPath || currentDir;
  const prepareChosen = chosenPath.replace(/^~/gim, getHomeDir());
  const folderPath = resolve(prepareChosen);
  const folderExists = existsSync(folderPath);
  if (!folderExists) {
    console.log(getText.error.path(folderPath));
    return;
  }
  
  const choice = await validateChoice(folderPath);
  if (!choice) {
    console.log(MESSAGES_NPM_CREDENTIALS.error.invalidChoice());
    return;
  }

  const isHap = email.includes("hapvida");
  const isAzul = email.includes("voeazul");
  if (!isAzul && !isHap) {
    console.log(MESSAGES_NPM_CREDENTIALS.error.unmappedEmail(email));
    return;
  }

  const fabric = isHap ? FabricEnum.HAPVIDA : FabricEnum.VOEAZUL;
  const type = choice === '1' ? "homedir" : "project";
  
  createOrUpdateNpmrc({ email, password, fabric, type, projectPath: folderPath })
}

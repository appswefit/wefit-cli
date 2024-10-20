import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { MESSAGES_NPM_CREDENTIALS } from "../constants";
import { convertPasswordToBase64 } from "./convertPasswordToBase64";
import { getNpmrc } from "./getNpmrc";
import type { INpmrc } from "./types";

/**
 * Cria ou atualiza o arquivo `.npmrc` com as credenciais necessárias.
 *
 * @param {INpmrc} options - Opções para criar ou atualizar o arquivo `.npmrc`.
 * @param {string} options.email - E-mail do usuário.
 * @param {string} options.password - Senha do usuário.
 * @param {string} options.fabric - Tipo de fabric (padrão: 'hap').
 * @param {string} options.type - Tipo de arquivo (padrão: 'homedir').
 * @param {string} options.projectPath - Caminho do projeto (padrão: diretório home do usuário).
 * @returns {void}
 */
export const createOrUpdateNpmrc = ({
  email = '',
  password = '',
  fabric = 'hapvida',
  type = 'homedir',
  projectPath = os.homedir().trim() ?? '/',
}: INpmrc): void => {
  if (!email || !password) {
    throw new Error(MESSAGES_NPM_CREDENTIALS.error.missingNpmrcCredentials());
  }
  
  const npmrcPath = path.resolve(projectPath, '.npmrc');
  const content = getNpmrc({ email, password: convertPasswordToBase64(password), fabric, type });

  try {
    if (existsSync(npmrcPath)) {
      appendFileSync(npmrcPath, content, 'utf8');
      console.log(`Atualizado ${npmrcPath}`);
    } else {
      writeFileSync(npmrcPath, content, 'utf8');
      console.log(`Criado ${npmrcPath}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(MESSAGES_NPM_CREDENTIALS.error.failedToCreateNpmrcFile(npmrcPath, error.message));
    } else {
      console.error(MESSAGES_NPM_CREDENTIALS.error.unknownError(error));
    }
  }
};

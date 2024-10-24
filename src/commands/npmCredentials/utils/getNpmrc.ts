import { MESSAGES_NPM_CREDENTIALS, NPM_RC } from "../constants";
import { FabricEnum } from "./fabric.enum";
import type { INpmrc } from "./types";

/**
 * Gera o conteúdo do arquivo `.npmrc` com base nas opções fornecidas.
 *
 * @param {INpmrc} options - Opções para gerar o conteúdo do arquivo `.npmrc`.
 * @param {string} options.email - E-mail do usuário.
 * @param {string} options.password - Senha do usuário em base64.
 * @param {string} options.fabric - Tipo de fabric (padrão: FabricEnum.HAPVIDA).
 * @param {string} options.type - Tipo de arquivo (padrão: 'homedir').
 * @returns {string} Conteúdo do arquivo `.npmrc`.
 */
export const getNpmrc = ({
  email = '',
  password = '',
  fabric = FabricEnum.HAPVIDA,
  type = 'homedir',
}: INpmrc): string => {
  if (!NPM_RC[type]) {
    throw new Error(MESSAGES_NPM_CREDENTIALS.error.unsupportedNpmrcType(type));
  }

  const npmrc = NPM_RC[type];
  const { base } = npmrc;
  const chosen = npmrc[fabric];

  if (!chosen) {
    throw new Error(MESSAGES_NPM_CREDENTIALS.error.unsupportedFabric(fabric));
  }

  const list = chosen.map((line, index) => {
    if ([0, 3].includes(index)) {
      return line;
    }

    if ([1, 4].includes(index)) {
      return `${line}${password}`;
    }

    return `${line}${email}`;
  });

  return ['\n', base[0], ...list, base[1]].join('\n');
};

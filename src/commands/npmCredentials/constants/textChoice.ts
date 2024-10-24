import { getHomeDir } from "../../setGitCredential/utils";

export const NPMRC_FILE_OPTIONS = {
  "1": `Criar ou atualizar '.npmrc' na $HOME (${getHomeDir()})`,
  "2": (path: string) => `Criar ou atualizar '.npmrc' no projeto (${path})`,
} as const;
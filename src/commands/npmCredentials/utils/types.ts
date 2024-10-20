import type { NPM_RC } from "../constants";

/**
 * Interface que define as propriedades básicas para autenticação.
 */
export interface BaseProps {
  /**
   * Senha do usuário.
   */
  password: string;

  /**
   * E-mail do usuário.
   */
  email: string;
}

/**
 * Interface que define as propriedades para configuração do arquivo `.npmrc`.
 * @extends BaseProps
 */
export interface INpmrc extends BaseProps {
  /**
   * Tipo de fabric (por exemplo, 'hapvida' ou 'voeazul').
   */
  fabric: 'hapvida' | 'voeazul';

  /**
   * Tipo de arquivo (por exemplo, 'homedir' ou 'project').
   */
  type?: keyof typeof NPM_RC;

  /**
   * Caminho do projeto (opcional).
   */
  projectPath?: string;
}
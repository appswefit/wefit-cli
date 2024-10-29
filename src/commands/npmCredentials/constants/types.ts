import { NPMRC_FILE_OPTIONS } from "./textChoice";

type PromptType = {
  /**
   * Retorna uma mensagem de prompt para solicitar o caminho local do repositório.
   *
   * @param {string} [folderPath=""] - O caminho local do repositório.
   * @returns {string} A mensagem de prompt.
   */
  getRepositoryPathPrompt: (folderPath: string) => string;

  /**
   * Retorna uma mensagem de prompt para solicitar o tipo de credencial do `.npmrc`.
   *
   * @param {string} [folderPath=""] - O caminho local do repositório.
   * @returns {string} A mensagem de prompt.
   */
  getTypePrompt: (folderPath: string) => string;

  /**
   * Retorna uma mensagem de confirmação após a escolha do usuário.
   *
   * @param {('1' | '2')} choice - A escolha do usuário.
   * @returns {string} A mensagem de confirmação.
   */
  goodChoice: (choice: keyof typeof NPMRC_FILE_OPTIONS) => string;
};

type ErrorType = {
  /**
   * Retorna uma mensagem de erro para e-mails não mapeados.
   *
   * @param {string} email - O e-mail não mapeado.
   * @returns {string} A mensagem de erro.
   */
  unmappedEmail: (email: string) => string;

  /**
   * Retorna uma mensagem de erro para escolhas inválidas.
   *
   * @returns {string} A mensagem de erro.
   */
  invalidChoice: () => string;

  /**
   * Retorna uma mensagem de erro para tipos de arquivo `.npmrc` não suportados.
   *
   * @param {string} type - O tipo de arquivo não suportado.
   * @returns {string} A mensagem de erro.
   */
  unsupportedNpmrcType: (type: string) => string;

  /**
   * Retorna uma mensagem de erro para tipos de fábrica não suportados.
   *
   * @param {string} fabric - O tipo de fábrica não suportado.
   * @returns {string} A mensagem de erro.
   */
  unsupportedFabric: (fabric: string) => string;

  /**
   * Retorna uma mensagem de erro para credenciais `.npmrc` ausentes.
   *
   * @returns {string} A mensagem de erro.
   */
  missingNpmrcCredentials: () => string;

  /**
   * Retorna uma mensagem de erro para falhas na criação do arquivo `.npmrc`.
   *
   * @param {string} npmrcPath - O caminho do arquivo npmrc.
   * @param {string} message - A mensagem de erro.
   * @returns {string} A mensagem de erro.
   */
  failedToCreateNpmrcFile: (npmrcPath: string, message: string) => string;

  /**
   * Retorna uma mensagem de erro para erros desconhecidos.
   *
   * @param {unknown} error - O erro desconhecido.
   * @returns {string} A mensagem de erro.
   */
  unknownError: (error: unknown) => string;

  /**
   * Retorna uma mensagem de erro para senha inválida.
   *
   * @returns {string} A mensagem de erro.
   */
  invalidPasswordError: () => string;
};

/**
 * Interface que define as propriedades para mensagens de texto usadas no comando `npmCredentials`.
 */
export interface IMessagesNpmCredentials {
  /**
   * Objeto contendo mensagens de prompt para interagir com o usuário.
   */
  prompt: PromptType;

  /**
   * Objeto contendo mensagens de erro para interagir com o usuário.
   */
  error: ErrorType;
}

import chalk from "chalk";
import { BREAK_LINE } from "../../setGitCredential/constants";
import { NPMRC_FILE_OPTIONS } from "./textChoice";
import type { IMessagesNpmCredentials } from "./types";

/**
 * Objeto contendo todos os textos usados ​​no comando `npmCredentials`.
 */
export const MESSAGES_NPM_CREDENTIALS: IMessagesNpmCredentials = {
  prompt: {
    getRepositoryPathPrompt: (folderPath) => {
      const repositoryPathPrompt = `Qual é o caminho do repositório que você precisa criar ou atualizar o \`.npmrc\`?${BREAK_LINE}`;
      const defaultFolderPathPrompt = `Deixe vazio para utilizar "${folderPath}"!${BREAK_LINE}`;
      const inputPrompt = "Digite aqui ou aperte \`Enter\` para continuar: ";
      return chalk.yellow(`${repositoryPathPrompt}${defaultFolderPathPrompt}${inputPrompt}`);
    },
    getTypePrompt: (folderPath) => {
      const credentialTypePrompt = `${BREAK_LINE}${BREAK_LINE}Qual é o tipo de \`.npmrc\` você quer criar ou atualizar?${BREAK_LINE}`;
      const infoPrompt = `Você pode escolher entre:${BREAK_LINE}`;
      const option1Prompt = `- Digite [1] para ${NPMRC_FILE_OPTIONS[1]}${BREAK_LINE}`;
      const option2Prompt = `- Digite [2] para ${NPMRC_FILE_OPTIONS[2](folderPath)}${BREAK_LINE}`;
      const decisionPrompt = "Qual será sua decisão? ";
      return chalk.yellow(`${credentialTypePrompt}${infoPrompt}${option1Prompt}${option2Prompt}${decisionPrompt}`);
    },
    goodChoice: (choice) => {
      const confirmationMessage = `${BREAK_LINE}👍 Boa escolha! Você escolheu`;
      const choiceText = `[${choice}] -> ${NPMRC_FILE_OPTIONS[choice]}`;
      const preparationMessage = `${BREAK_LINE}Estamos preparando o necessário para você.`;
      return chalk.green(`${confirmationMessage} ${choiceText}...${preparationMessage}`);
    },
  },
  error: {
    unmappedEmail: (email) => {
      return chalk.red(`${BREAK_LINE}❌ E-mail "${email}" não faz parte das organizações mapeadas!`);
    },
    invalidChoice: () => {
      return chalk.red(`${BREAK_LINE}❌ Escolhida opção inexistente!`);
    },
    unsupportedNpmrcType: (type) => {
      return chalk.red(`${BREAK_LINE}❌ 'Tipo de arquivo não suportado: ${type}'! ⚠️`);
    },
    unsupportedFabric: (fabric: string) => {
      return chalk.red(`${BREAK_LINE}❌ 'Tipo de fábrica não suportado: ${fabric}'! ⚠️`);
    },
    missingNpmrcCredentials: () => {
      return chalk.red(`${BREAK_LINE}❌ E-mail e senha não foram encontrados! ⚠️`);
    },
    failedToCreateNpmrcFile: (npmrcPath: string, message: string) => {
      return chalk.red(`${BREAK_LINE}❌ Erro ao criar ou atualizar ${npmrcPath}: ${message}. ⚠️`);
    },
    unknownError: (error: unknown) => {
      return chalk.red(`❌ Erro desconhecido ⚠️: ${error}`);
    },
    invalidPasswordError: () => {
      return chalk.red(`❌ Senha não pode ser vazia ou nula. ⚠️`);
    },
  },
} as const;

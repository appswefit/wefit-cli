import chalk from "chalk";
import { BREAK_LINE, TEXT_CHOICE } from "../constants";
import { ChoiceEnum, TextChoice } from "../interface";

export const getText = {
  invalid: {
    length: (size = 0) =>
      chalk.redBright(
        `${BREAK_LINE}❌ O tamanho da credencial é ${size}. Essa credencial é inválida.`
      ),
  },
  error: {
    path: (path = "") =>
      chalk.red(`${BREAK_LINE}❌ Caminho "${path}" não encontrado!`),
    remoteUrl: (path = "") =>
      chalk.red(
        `${BREAK_LINE}❌ [FATAL]: O caminho "${path}" não é um repositório git (ou qualquer um dos diretórios pai): .git!`
      ),
  },
  prompt: {
    path: (folderPath = "") => {
      const firstLine = `Qual é o caminho do repositório que você precisa atualizar a credencial?${BREAK_LINE}`;
      const secondLine = `Deixe vazio para utilizar "${folderPath}"!${BREAK_LINE}`;
      const thirdLine = "Digite aqui ou confirme para continuar:";
      return chalk.yellow(`${firstLine}${secondLine}${thirdLine}`);
    },
    result: () => {
      const { ONE, TWO } = ChoiceEnum;
      const firstLine = `Você quer executar o comando ou enviar para a área de transferência?${BREAK_LINE}`;
      const secondLine = `- Digite ${ONE} para ${TEXT_CHOICE[ONE]}${BREAK_LINE}`;
      const thirdLine = `- Digite ${TWO} para ${TEXT_CHOICE[TWO]}${BREAK_LINE}`;
      const fourthLine = "Qual será sua decisão? ";

      return chalk.yellow(`${firstLine}${secondLine}${thirdLine}${fourthLine}`);
    },
  },
  insert: (credential = "", path = "") =>
    chalk.yellow(
      `${BREAK_LINE}*** A credencial ${credential} será inserida em ${path} ***`
    ),
  git: {
    remote: (path = "") => {
      const cd = `cd "${path}"`;
      const gitCommand =
        "git remote -v | head -n 1 | awk '/origin/ {print $2}'";
      return `${cd} && ${gitCommand}`;
    },
    setUrl: (url = "") => `git remote set-url origin ${url}`,
    args: {
      remote: () => ["git", "remote", "-v"],
      setUrl: (url = "") => ["git", "remote", "set-url", "origin", url],
    },
  },
  clipboard: (command = "") =>
    chalk.yellow(
      `O comando "${command}" já está na área de transferência${BREAK_LINE}`
    ),

  goodChoice: (choice: TextChoice) => {
    const firstLine = `${BREAK_LINE}👍 Boa escolha! Você escolheu`;
    const secondLine = `${BREAK_LINE}Estamos preparando o necessário para você.`;
    const choiceText = `[${choice}] - ${TEXT_CHOICE[choice]}`;
    return chalk.green(`${firstLine} ${choiceText}...${secondLine}`);
  },
};

import chalk from "chalk";
import { ChoiceEnum, TextChoice } from "./interface";

const FINAL_CHOICE: TextChoice[] = [ChoiceEnum.ONE, ChoiceEnum.TWO];

const TEXT_CHOICE: Record<TextChoice, string> = {
  "1": "Executar o comando",
  "2": "Enviar para a área de transferência",
};

const MIN_LENGTH_CREDENTIAL = 52;

const REGEX = {
  remote: /(.*\/\/.*)(:.*@)(.*$)/gim,
};

const TEXTS = {
  example: chalk.redBright('~ we set-git-credential "my new credential" # or'),
  exampleShort: chalk.redBright('~ we sgc "my new credential"'),
  invalid: chalk.redBright("\n❌ Digite a credencial ⚠️"),
  invalidLength: (size = 0) =>
    chalk.redBright(
      `\n❌ O tamanho da credencial é ${size}. Essa credencial é inválida.`
    ),
  invalidPath: (path = "") =>
    chalk.red(`\n❌ Caminho "${path}" não encontrado!`),
  invalidRemoteUrl: (path = "") =>
    chalk.red(
      `\n❌ [FATAL]: O caminho "${path}" não é um repositório git (ou qualquer um dos diretórios pai): .git!`
    ),
  invalidExecution: chalk.redBright(
    `\n❌ Tivemos um problema ao executar o comando!\n𝌕 Favor entrar em contato com o suporte ☏.`
  ),
  invalidReason: chalk.redBright(
    `\n🚨 Algo de errado não está certo ⚠️!\n𝌕 Favor entrar em contato com o suporte ☏.`
  ),
  welcome: chalk.yellow("\n🛠️ Vamos lá! 🛠️"),
  promptPath: (dir = "") => {
    const firstLine =
      "Qual é o caminho do repositório que você precisa atualizar a credencial?";
    const secondLine = `Deixe vazio para utilizar "${dir}"!`;
    const thirdLine = "Digite aqui ou confirme para continuar:";
    return chalk.yellow(`${firstLine}\n${secondLine}\n${thirdLine}`);
  },
  promptResult: () => {
    const { ONE, TWO } = ChoiceEnum;
    const firstLine =
      "Você quer executar o comando ou enviar para a área de transferência?";
    const secondLine = `- Digite ${ONE} para ${TEXT_CHOICE[ONE]}`;
    const thirdLine = `- Digite ${TWO} para ${TEXT_CHOICE[TWO]}`;
    const fourthLine = "Qual será sua decisão? ";

    return chalk.yellow(
      `${firstLine}\n${secondLine}\n${thirdLine}\n${fourthLine}`
    );
  },
  insert: (credential = "", path = "") =>
    chalk.yellow(
      `\n*** A credencial ${credential} será inserida em ${path} ***`
    ),
  remoteCommand: (path = "") => {
    const cd = `cd "${path}"`;
    const gitCommand = "git remote -v | head -n 1 | awk '/origin/ {print $2}'";
    return `${cd} && ${gitCommand}`;
  },
  command: (url = "") => `git remote set-url origin ${url}`,
  clipboard: (command = "") =>
    chalk.yellow(`O comando \`${command}\` já está na área de transferência\n`),
  again: chalk.yellow("\nVamos tentar novamente...\n"),
  goodChoice: (choice: TextChoice) => {
    const firstLine = "👍 Boa escolha! Você escolheu";
    const secondLine = "Estamos preparando o necessário para você.";
    return chalk.green(
      `\n${firstLine} ${TEXT_CHOICE[choice]}...\n${secondLine}`
    );
  },
  success: chalk.green("\n✅ Sucesso! Sua credencial foi atualizada! ✅"),
};

export { FINAL_CHOICE, MIN_LENGTH_CREDENTIAL, TEXT_CHOICE, TEXTS, REGEX };

import chalk from "chalk";
import { EOL } from "node:os";
import { ChoiceEnum, TextChoice } from "./interface";

const FINAL_CHOICE: TextChoice[] = [ChoiceEnum.ONE, ChoiceEnum.TWO];

const TEXT_CHOICE: Record<TextChoice, string> = {
  "1": "Executar o comando",
  "2": "Enviar para a área de transferência",
};

const BREAK_LINE = EOL;
const MIN_LENGTH_CREDENTIAL = 52;

const GIT_COMMANDS = {
  status: ["status"],
  remote: ["remote", "-v"],
  setUrl: ["remote", "set-url", "origin"],
};

const REGEX = {
  remoteUrlMatch: /origin\s+(.*?)\s+/i,
  credentialMatch: /(.*\/\/.*)(:.*@)(.*$)/i,
} as const;

const TEXTS = {
  again: chalk.yellow(`${BREAK_LINE}Vamos tentar novamente...${BREAK_LINE}`),
  breakLine: BREAK_LINE,
  error: {
    call: chalk.red(`🚨 Erro da chamada:${BREAK_LINE}`),
    execute: chalk.red("🚨 Erro ao executar o comando:"),
    reason: chalk.red(
      `${BREAK_LINE}🚨 Algo de errado não está certo ⚠️!${BREAK_LINE}𝌕 Favor entrar em contato com o suporte ☏.`
    ),
    verifyRemote: chalk.red("🚨 Erro ao verificar a URL remota."),
  },
  example: {
    long: chalk.redBright('~ we set-git-credential "my new credential" # or'),
    short: chalk.redBright('~ we sgc "my new credential"'),
  },
  invalid: {
    credential: chalk.redBright(`${BREAK_LINE}❌ Digite a credencial ⚠️`),
    credentialMatch: chalk.redBright(
      "❌ A URL remota não contém uma credencial. ⚠️"
    ),
    execution: chalk.redBright(
      `${BREAK_LINE}❌ Tivemos um problema ao executar o comando!${BREAK_LINE}𝌕 Favor entrar em contato com o suporte ☏.`
    ),
    gitStatus: chalk.redBright("❌ A pasta não é um repositório Git. ⚠️"),
    remoteUrl: chalk.redBright("❌ A URL remota não foi encontrada. ⚠️"),
  },
  success: chalk.green(
    `${BREAK_LINE}✅ Sucesso! Sua credencial foi atualizada! ✅`
  ),
  welcome: chalk.yellow(`${BREAK_LINE}🛠️  Vamos lá! 🛠️`),
} as const;

export {
  BREAK_LINE,
  FINAL_CHOICE,
  GIT_COMMANDS,
  MIN_LENGTH_CREDENTIAL,
  REGEX,
  TEXTS,
  TEXT_CHOICE,
};

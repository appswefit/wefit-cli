#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";

import figmaGenerate from "./commands/figma-generate";
import setGitRemoteCredential from "./commands/setGitCredential";
import translationExport from "./commands/translatation-export";
import translationImport from "./commands/translation-import";
import wefitLogo from "./constants/wefitLogo";

console.log(chalk.yellow(wefitLogo));

yargs(process.argv.slice(2))
  .command({
    command: "figma-generate",
    describe: "Criar arquivo de estilos base",
    handler: () => figmaGenerate({}),
    aliases: ["figma-generate", "fg"],
  })
  .command({
    command: "translation-export",
    describe: "Exporta os arquivos da pasta locales para xlsx",
    handler: () => translationExport(),
    aliases: ["translation-export", "te"],
  })
  .command({
    command: "translation-import",
    describe: "Importa a planilha de tradução",
    handler: () => translationImport(),
    aliases: ["translation-import", "ti"],
  })
  .command({
    command: "set-git-credential",
    describe: "Seta a nova credencial para o repositório",
    handler: () => {
      const credential = process.argv[3];
      setGitRemoteCredential(credential);
    },
    aliases: ["set-git-credential", "sgc"],
  })
  .example([
    ["$0 figma-generate", "Criar arquivo de estilos base"],
    ["$0 fg", "Short syntax\n"],

    ["$0 translation-export", "Exporta os arquivos da pasta locales para xlsx"],
    ["$0 te", "Short syntax\n"],

    ["$0 translation-import", "Importa a planilha de tradução"],
    ["$0 ti", "Short syntax\n"],

    [
      "$0 setGitCredential yourNewCredential",
      "Atualiza a credencial do repositório",
    ],
    ['$0 sgc "your New Credential"', "Short syntax\n"],
  ])
  .help("h")
  .alias("h", "help").argv;

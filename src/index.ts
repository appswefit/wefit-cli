#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";

import figmaGenerate from "./commands/figma-generate";
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
  .help("h")
  .alias("h", "help").argv;

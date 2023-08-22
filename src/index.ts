#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";

import figmaGenerate from "./commands/figma-generate";
import wefitLogo from "./constants/wefitLogo";
import translationExport from "./commands/translatation-export";
import translationImport from "./commands/translation-import";

console.log(chalk.yellow(wefitLogo));

yargs(process.argv.slice(2))
  .command(
    "figma-generate",
    "Criar arquivo de estilos base",
    (yargs) => {},
    (args) => {
      figmaGenerate({});
    }
  )
  .command(
    "translation-export",
    "Exporta os arquivos da pasta locales para xlsx",
    () => {},
    () => {
      translationExport();
    }
  )
  .command(
    "translation-import",
    "Importa a planilha de tradução",
    () => {},
    () => {
      translationImport();
    }
  )
  .help("h")
  .alias("h", "help").argv;

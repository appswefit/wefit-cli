#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";

import figmaGenerate from "./commands/figma-generate";
import wefitLogo from "./constants/wefitLogo";

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
  .help("h")
  .alias("h", "help").argv;

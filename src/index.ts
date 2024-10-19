#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";

import figmaGenerate from "./commands/figma-generate";
import setGitRemoteCredential from "./commands/setGitCredential";
import translationExport from "./commands/translatation-export";
import translationImport from "./commands/translation-import";
import wefitLogo from "./constants/wefitLogo";
import runVSCodeCommand from "./commands/vscode-extensions";
import bumpVersion from "./commands/rn-bump-version";

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
  .command({
    command: "vscode-extensions",
    describe: "Instala as extensões para VS Code recomendadas pela WeFit.",
    handler: () => {
      runVSCodeCommand();
    },
    aliases: ["vscode-extensions", "ve"],
  })
  .command({
    command: 'rn-bump-version',
    describe: 'Atualiza a versão do projeto React Native nos ambientes Android e iOS',
    handler: () => bumpVersion(),
    aliases: ['rn-bump-version', 'rnbv'],
  })
  .example([
    ["$0 figma-generate", "Criar arquivo de estilos base"],
    ["$0 fg", "Short syntax\n"],

    ["$0 translation-export", "Exporta os arquivos da pasta locales para xlsx"],
    ["$0 te", "Short syntax\n"],

    ["$0 translation-import", "Importa a planilha de tradução"],
    ["$0 ti", "Short syntax\n"],

    ["$0 setGitCredential yourNewCredential", "Atualiza a credencial do repositório"],
    ['$0 sgc "your New Credential"', "Short syntax\n"],

    ["$0 vscode-extensions","Instala as extensões para VS Code recomendadas pela WeFit."],
    ["$0 ve", "Short syntax\n"],

    ["$0 rn-bump-version", "Atualiza a versão do projeto RN nas pastas nativas do Android e iOS"],
    ["$0 rnbv", "Short syntax\n"],

    ["$0 update-npmrc", "Atualize o \`.npmrc\` do usuário com as credenciais necessárias"],
    ["$0 npmrc", "Short syntax\n"],
  ])
  .help("h", "Exibe informações detalhadas dos comandos suportados no WeFit CLI")
  .alias("h", "help")
  .version(
    "v",
    "Exibe a versão instalada do WeFit CLI",
    chalk.bold("WeFit CLI v1.3.0\n\nPara maiores informações, consulte: https://github.com/appswefit/wefit-cli")
  )
  .alias("v", "version")
  .argv;

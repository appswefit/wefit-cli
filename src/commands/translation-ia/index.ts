import inquirer from 'inquirer';
import ollama from 'ollama'
import loading from '../../utils/loading';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { removeSpecialCharacters } from './utils/removeSpecialCharacters';
import os, { platform } from 'os';
import { OperatingSystemPlatforms } from './utils/operatingSystem';

export const platformOS = platform() as OperatingSystemPlatforms;

export default async function translatationIA() {
  console.log(chalk.whiteBright('👇 Siga os passos abaixo para obter seus dicionários!'));

  const { filePath } = await inquirer.prompt({
    name: 'filePath',
    type: 'input',
    message: 'Digite o caminho ou arraste e solte o arquivo base para ser traduzido:',
  });

  const { languaguesToTranslate } = await inquirer.prompt({
    name: 'languaguesToTranslate',
    type: 'checkbox',
    message: 'Escolha os idiomas que você deseja para gerar os novos dicionários:',
    choices: [
      { name: 'Inglês', value: "english", short: 'en' },
      { name: 'Espanhol', value: "spanish", short: 'es' }
    ]
  });

  console.log(languaguesToTranslate)

  const rawData = fs.readFileSync(removeSpecialCharacters(filePath, platformOS), 'utf-8');
  const baseDictionary = JSON.parse(rawData);

  const messageLoader = loading("");
  try {
    messageLoader.start("🤖 Processando sua solicitação e obtendo resultados...");

    // const response = await ollama.chat({
    //   model: 'deepseek-r1:8b',
    //   messages: [
    //     {
    //       role: 'user',
    //       content: `
    //         Como um tradutor profissional e poliglota,
    //         preciso que você analise o json informado abaixo.
    //         Neste json você vai se basear para criar novas chaves ou traduzir valores.
    //         Identifique quais são as chaves que estão com seus respectivos valores sem tradução e as traduza,
    //         lembrando que nenhuma escrita da chave pode ser modificada, apenas os seus valores.
    //         Caso você não encontre a chave de referência no json base,
    //         crie exatamente da mesma forma no novo json, seguindo o mesmo padrão e estrutura
    //         do json base.
    //         Por fim, aplique as traduções apenas e exclusivamente nessas chaves
    //         ou em valores que não tenham sido traduzido, e retorne apenas os dados em json com os valores traduzido
          
    //         Aqui está os dados do json base: ${JSON.stringify(baseDictionary)};
    //       `
    //     }
    //   ]
    // });
    // console.log(response)
    messageLoader.succeed("✅");
  } catch (error) { 
    console.log(error)
    messageLoader.fail();
  }
}
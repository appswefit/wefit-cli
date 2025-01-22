import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import { removeSpecialCharacters } from './utils/removeSpecialCharacters';
import { supportedFiles } from './utils/supportedFiles';
import { platformOS, slashFormatByPlatformOS } from './utils/operatingSystem';
import { compressVideo } from './utils/compressVideo';


export default async function compressVideoPrompts() {
  console.log(chalk.whiteBright('👇 Siga os passos abaixo para comprimir o vídeo! \n'));

  try {
    const { inputPath } = await inquirer.prompt({
      type: 'input',
      name: 'inputPath',
      message: chalk.yellow(`Digite o diretório ou arraste e solte o vídeo que deseja comprimido (ex: /Users/wefit/video.mov): `),
      validate: (input) => {
        const inputPath = removeSpecialCharacters(input, platformOS);
        const fileExtension = inputPath.split('.').pop();

        if (!(fileExtension && fileExtension in supportedFiles)) return `${chalk.red('O arquivo escolhido através deste diretório não é um tipo de arquivo suportado!')}. Insira um arquivo do tipo ${Object.values(supportedFiles).join(', ').toLocaleUpperCase()}!`;        
        if (!fs.existsSync(inputPath)) return `${chalk.red('Não foi possível encontrar o diretório informado do vídeo')}. Digite o diretório corretamente!`;        
        return true;
      },
    });

    const cleanInputPath = removeSpecialCharacters(inputPath, platformOS);
    const filePath = cleanInputPath.split(slashFormatByPlatformOS[platformOS]).slice(0, -1).join(slashFormatByPlatformOS[platformOS]);
    const oldFileName = cleanInputPath.split(slashFormatByPlatformOS[platformOS]).pop()?.split(".").shift();
    
    const { outputPath } = await inquirer.prompt({
      type: 'input',
      name: 'outputPath',
      message: chalk.yellow('Digite o diretório para onde será salvo o video comprimido, ou ENTER para seguir:'),
      default: filePath,
      validate: (output) => {
        const outputPath = output.trim();
        if (!fs.existsSync(outputPath)) return chalk.red('O diretório para salvar o vídeo comprimido informado não existe');
        return true;
      },
    });

    const { fileName } = await inquirer.prompt({
      type: 'input',
      name: 'fileName',
      message: chalk.yellow('Digite o nome que será salvo no arquivo do video comprimido, ou ENTER para seguir:'),
      default: `[compressed]-${oldFileName}`,
      validate: (name) => !name ? chalk.red('O nome do arquivo não pode estar vazio!') : true,
    });

    const fileExtension = "mp4";
    // const { fileExtension } = await inquirer.prompt({
    //   type: 'checkbox',
    //   name: 'fileExtension',
    //   message: chalk.yellow('Escolha a opção de extensão para o vídeo comprimido'),
    //   choices: [
    //     { name: 'MP4', checked: true, value: 'mp4' },
    //     { name: 'MOV', value: 'mov' },
    //   ],
    // });
    
    const outputFile = `${outputPath}${slashFormatByPlatformOS[platformOS]}${fileName}.${fileExtension}`
    await compressVideo(cleanInputPath, outputFile);
  } catch (err: any) {
    console.error(chalk.red('❌ Ocorreu um erro:'), err.message);
  }
}


import chalk from 'chalk';
import inquirer from 'inquirer';
import loading from "../../utils/loading";
import fs from 'fs';
import { removeSpecialCharacters } from './utils/removeSpecialCharacters';
import { supportedFiles } from './utils/supportedFiles';
import { platform } from 'os';
import { OperatingSystemPlatforms } from './utils/operatingSystem';

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const platformOS = platform() as OperatingSystemPlatforms;

async function compressVideo(inputPath: string, outputPath: string) {
  const compressingLoader = loading("");

  ffmpeg(inputPath)
    .outputOptions([])
    .save(outputPath)
    .on('start', () => compressingLoader.start('Processando e comprimindo o vídeo...'))
    .on('end', () => {
      compressingLoader.succeed(chalk.greenBright('✅ Vídeo comprimido com sucesso!'));
      console.log(chalk.green(`\n O vídeo comprimido foi salvo em: ${outputPath}`));
    })
    .on('error', (error: any) => {
      compressingLoader.fail(chalk.red(error.message));
    })
    
};

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

        if (!(fileExtension && fileExtension in supportedFiles)) return `${chalk.red('O arquivo escolhido através deste diretório não é um tipo de arquivo suportado!')}. Insira um arquivo MOV ou MP4! (.mov ou .mp4 ao final do diretório)`;        
        if (!fs.existsSync(inputPath)) return `${chalk.red('Não foi possível encontrar o diretório informado do vídeo')}. Digite o diretório corretamente!`;        
        return true;
      },
    });

    const cleanInputPath = removeSpecialCharacters(inputPath, platformOS);
    const filePath = cleanInputPath.split("/").slice(0, -1).join("/");
    const oldFileName = cleanInputPath.split("/").pop()?.split(".").shift();
    
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
    
    const outputFile = `${outputPath}/${fileName}.${fileExtension}`.split('/').join('/');
    await compressVideo(cleanInputPath, outputFile);
  } catch (err: any) {
    console.error(chalk.red('❌ Ocorreu um erro:'), err.message);
  }
}


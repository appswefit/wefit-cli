import chalk from 'chalk';
import ffmpeg from 'fluent-ffmpeg';
import inquirer from 'inquirer';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import loading from "../../utils/loading";

const compress = (inputPath: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([])
      .save(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err));
  });
};

export default async function compressVideo() {
  console.log(chalk.whiteBright('Siga os passos abaixo para comprimir o vídeo! \n'));

  try {
    const { inputPath } = await inquirer.prompt({
      type: 'input',
      name: 'inputPath',
      message: chalk.yellow('Digite o caminho do vídeo que será comprimido (o nome do arquivo não pode conter espaços):'),
      validate: (input) => input.trim() && !input.split("").includes(" ") ? true : 'O caminho do vídeo que será comprimido não pode estar vazio ou conter espaços na escrita!',
    });

    const filePath = inputPath.split("/").slice(0, -1).join("/");
    const oldFileName = inputPath.split("/").pop();
    
    const { outputPath } = await inquirer.prompt({
      type: 'input',
      name: 'outputPath',
      message: chalk.yellow('Digite o caminho de onde salvar o video comprimido:'),
      default: filePath,
      validate: (output) => output.trim() ? true : 'O caminho para salvar o video comprimido não pode estar vazio!',
    });

    const { fileName } = await inquirer.prompt({
      type: 'input',
      name: 'fileName',
      message: chalk.yellow('Digite o nome que será salvo no video comprimido:'),
      default: `compressed-${oldFileName}`,
      validate: (output) => output.trim() ? true : 'O nome do video comprimido não pode estar vazio!',
    });

    const compressingLoader = loading('\n ⏳ Iniciando a compressão do vídeo...\n');
    compressingLoader.start();

    const outputFile = `${outputPath}/${fileName}`;
    await compress(inputPath, outputFile);

    compressingLoader.succeed('✅ Vídeo comprimido com sucesso!');
    console.log(chalk.green(`Arquivo salvo em: ${outputFile}`));
  } catch (err: any) {
    console.error(chalk.red('❌ Erro ao comprimir o vídeo:'), err.message);
  }
}


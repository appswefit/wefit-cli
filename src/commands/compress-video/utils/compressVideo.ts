import chalk from "chalk";
import loading from "../../../utils/loading";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export async function compressVideo(inputPath: string, outputPath: string) {
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
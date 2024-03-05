import { resolve } from 'path';
import { 
  existsSync,
  readFileSync,
  writeFileSync,
  readFile,
  readdirSync
} from 'fs'

import chalk from 'chalk';
import { parse, build, PlistValue, PlistObject } from 'plist';
import inquirer, {QuestionCollection, Answers} from 'inquirer'

interface IGenerateQuestions {
  defaultSemanticVersion: string
}

interface QuestionsAnswers extends Answers {
  platforms: Array<string>,
  androidSemanticVersion?: string,
  androidToBeIncremented?: boolean,
  androidIncrementalVersion?: number | null,
  iosXcodeHigherVersion?: boolean,
  iosSemanticVersion?: string,
  iosToBeIncremented?: boolean,
  iosIncrementalVersion?: number | null,
}

interface IUpdateFunction {
  currentDir: string
  semanticVersion: string
  autoIncrement: boolean
  incrementalVersion?: number | null
}

interface IUpdateIOS extends IUpdateFunction {
  xcodeHigherVersion: boolean
}

interface IPlistFile extends PlistObject {
  CFBundleShortVersionString: PlistValue
  CFBundleVersion: PlistValue
}

function generateQuestions({ 
  defaultSemanticVersion
}: IGenerateQuestions): QuestionCollection<QuestionsAnswers> {
  return [
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Quais plataformas você deseja atualizar?',
      choices: [
        {
          name: 'Android',
          checked: true,
        },
        {
          name: 'iOS',
          checked: true,
        }
      ],
      validate(answer: Answers) {
        if (answer.length < 1) {
          return 'É necessário selecionar ao menos uma plataforma.';
        }

        return true;
      },
    },
    {
      type: 'input',
      name: 'androidSemanticVersion',
      message: '[🤖 Android] Qual a versão semântica (versionName) do projeto?',
      default: defaultSemanticVersion,
      when(answer) {
        return answer.platforms.includes('Android')
      },
      validate(answer) {
        if (!answer.match(/\d+\.\d+\.\d+/)) {
          return 'A versão semântica deve estar no padrão 0.0.0'
        }

        return true
      }
    },
    {
      type: 'confirm',
      name: 'androidToBeIncremented',
      message: '[🤖 Android] Deseja incrementar a versão incremental (versionCode) do projeto?',
      default: true,
      when(answer) {
        return answer.platforms.includes('Android')
      },
    },
    {
      type: 'input',
      name: 'androidIncrementalVersion',
      message: '[🤖 Android] Qual a versão incremental do projeto? (Deixe em branco para não alterar)',
      when(answer) {
        return (!answer.androidToBeIncremented && answer.platforms.includes('Android'))
      },
      validate(answer) {
        if (!answer.match(/^\d+$/) && answer !== '') {
          return 'A versão incremental deve ser um número inteiro positivo'
        }

        return true
      }
    },
    {
      type: 'confirm',
      name: 'iosXcodeHigherVersion',
      message: '[🍎 iOS] Projeto rodando com XCode na versão 11 ou superior?',
      default: true,
      when(answer) {
        return answer.platforms.includes('iOS')
      },
    },
    {
      type: 'input',
      name: 'iosSemanticVersion',
      message: '[🍎 iOS] Qual a versão semântica (CFBundleShortVersionString) do projeto?',
      default: defaultSemanticVersion,
      when(answer) {
        return answer.platforms.includes('iOS')
      },
      validate(answer) {
        if (!answer.match(/\d+\.\d+\.\d+/)) {
          return 'A versão semântica deve estar no padrão 0.0.0'
        }

        return true
      }
    },
    {
      type: 'confirm',
      name: 'iosToBeIncremented',
      message: '[🍎 iOS] Deseja incrementar a versão incremental (CFBundleVersion) do projeto?',
      default: true,
      when(answer) {
        return answer.platforms.includes('iOS')
      },
    },
    {
      type: 'input',
      name: 'iosIncrementalVersion',
      message: '[🍎 iOS] Qual a versão incremental do projeto? (Deixe em branco para não alterar)',
      when(answer) {
        return (!answer.iosToBeIncremented && answer.platforms.includes('iOS'))
      },
      validate(answer) {
        if (!answer.match(/^\d+$/) && answer !== '') {
          return 'A versão incremental deve ser um número inteiro positivo'
        }

        return true
      }
    },
  ]
}

function androidUpdateVersion({
  currentDir,
  semanticVersion,
  incrementalVersion,
  autoIncrement,
}: IUpdateFunction) {
  const buildGradlePath = resolve(currentDir, 'android/app/build.gradle');

  readFile(buildGradlePath, 'utf-8', (error, data) => {
    if (error) {
      console.log(chalk.red(`❌ Não foi possível acessar o arquivo de configuração do projeto Android`));
      return
    }
  
    let updatedBuildGradle = data
      .replace(/versionName \d+(\.\d+)*/,`versionName ${semanticVersion}`);
    
    if (autoIncrement) {
      updatedBuildGradle = updatedBuildGradle
        .replace(/versionCode (\d+)/, (_, p1) => {
          const incrementedVersionCode = parseInt(p1, 10) + 1;
          return `versionCode ${incrementedVersionCode}`;
        });
    } else if (incrementalVersion) {
      updatedBuildGradle = updatedBuildGradle
        .replace(/versionCode (\d+)/, `versionCode = ${incrementalVersion}`);
    }
      
    try {
      writeFileSync(buildGradlePath, updatedBuildGradle, 'utf-8');
    } catch {
      console.log(chalk.red(`❌ Não foi possível gravar as alterações no projeto Android`));
      return
    }

    console.log(chalk.green('✔ Projeto Android atualizado com sucesso!'))
  });
}

function iosUpdateVersion({
  currentDir,
  semanticVersion,
  incrementalVersion,
  autoIncrement,
  xcodeHigherVersion,
}: IUpdateIOS) {
  const iosPath = resolve(currentDir, 'ios');

  const iosExists = existsSync(iosPath);
  if (!iosExists) {
    console.log(chalk.red(`❌ Não foi possível encontrar os arquivos de configuração do projeto iOS`));
    return;
  }

  const iosFolders = readdirSync(iosPath);
  const xcodeProjFolder = iosFolders.filter(dir => dir.endsWith('.xcodeproj'));

  if (xcodeProjFolder.length === 0) {
    console.log(chalk.red(`❌ Não foi possível encontrar os arquivos de configuração do projeto iOS`));
    return
  }

  const iosProjectName = xcodeProjFolder[0].split('.').at(0)
  const plistFilePath = resolve(currentDir, `ios/${iosProjectName}/Info.plist`)
  const plistExists = existsSync(plistFilePath)

  if (!plistExists) {
    console.log(chalk.red(`❌ Não foi possível acessar o arquivo Info.plist no diretório ${plistFilePath}`));
    return
  }

  const plistData = parse(readFileSync(plistFilePath, 'utf8')) as IPlistFile;

  if (!xcodeHigherVersion) {
    plistData.CFBundleShortVersionString = semanticVersion;

    if (autoIncrement) {
      const incrementalVersion = isNaN(Number(plistData.CFBundleVersion)) 
        ? 1
        : Number(plistData.CFBundleVersion) + 1

      plistData.CFBundleVersion = incrementalVersion;
    } else if (incrementalVersion) {
      plistData.CFBundleVersion = incrementalVersion
    }

    try {
      writeFileSync(plistFilePath, build(plistData));
      console.log(chalk.green('✔ Projeto iOS atualizado com sucesso!'))
      return
    } catch {
      console.log(chalk.red(`❌ Não foi possível gravar as alterações no arquivo Info.plist do iOS`));
      return
    }
  } else {
    plistData.CFBundleShortVersionString = '$(MARKETING_VERSION)';
    plistData.CFBundleVersion = '$(CURRENT_PROJECT_VERSION)';

    writeFileSync(plistFilePath, build(plistData));
  }


  const iosVersionPath = resolve(currentDir, `ios/${xcodeProjFolder[0]}/project.pbxproj`);

  readFile(iosVersionPath, 'utf-8', (error, data) => {
    if (error) {
      console.log(chalk.red(`❌ Não foi possível acessar o arquivo de configuração do projeto iOS`));
      return
    }

    let updatedProject = data
      .replace(/MARKETING_VERSION = \d+(\.\d+)*/g, `MARKETING_VERSION = ${semanticVersion}`);

    if (autoIncrement) {
      updatedProject = updatedProject
        .replace(/CURRENT_PROJECT_VERSION = (\d+)/g, (_, p1) => {
          const incrementedVersionCode = parseInt(p1, 10) + 1;
          return `CURRENT_PROJECT_VERSION = ${incrementedVersionCode}`;
        });
    } else if (incrementalVersion) {
      updatedProject = updatedProject
        .replace(/CURRENT_PROJECT_VERSION = (\d+)/g, `CURRENT_PROJECT_VERSION = ${incrementalVersion}`);
    }

    try {
      writeFileSync(iosVersionPath, updatedProject, 'utf-8')
    } catch {
      console.log(chalk.red(`❌ Não foi possível gravar as alterações no projeto iOS`));
      return
    }
  })

  console.log(chalk.green('✔ Projeto iOS atualizado com sucesso!'))
}

export default async function bumpVersion() {
  const currentDir = process.cwd();
  const packageJsonPath = resolve(currentDir, 'package.json')

  console.log(chalk.yellow("🛠️ Iniciando atualização das versões do projeto React Native"));

  const packageJsonExists = existsSync(packageJsonPath)
  if (!packageJsonExists) {
    console.log(chalk.red(`❌ Não foi possível encontrar o arquivo package.json no diretório atual`));
    console.log(chalk.yellow(`⚠️ Certifique-se de estar na raiz do projeto React Native!`));
    return;
  }

  const semanticVersion = JSON.parse(readFileSync(packageJsonPath).toString()).version;

  const questions = generateQuestions({
    defaultSemanticVersion: semanticVersion,
  })

  inquirer.prompt(questions).then((answers) => {
    if (answers.platforms.includes('Android')) {
      androidUpdateVersion({
        currentDir,
        autoIncrement: answers.androidToBeIncremented!,
        semanticVersion: answers.androidSemanticVersion!,
        incrementalVersion: answers.androidIncrementalVersion
      })
    }

    if (answers.platforms.includes('iOS')) {
      iosUpdateVersion({
        currentDir,
        autoIncrement: answers.iosToBeIncremented!,
        semanticVersion: answers.iosSemanticVersion!,
        incrementalVersion: answers.iosIncrementalVersion,
        xcodeHigherVersion: answers.iosXcodeHigherVersion!,
      })
    }
  })
}
import { spawnSync } from "child_process";
import chalk from "chalk";
import loading from "../../utils/loading";

async function runVSCodeCommand() {

  const fetchLoading = loading('Buscando extensões...');

  try {

    fetchLoading.start();
    const extensions = await fetch('https://raw.githubusercontent.com/appswefit/wefit-cli-gist/master/vs-code-extensions.json');
    const extensionsJson = await extensions.json();
    fetchLoading.stop();
  
    for (let extension of extensionsJson.extensions) {
      const extensionInstallLoading = loading(`Executando instalação da extensão: ${extension.name} \n`);
      extensionInstallLoading.start();
      
      const { error, stdout, stderr } = spawnSync("code", ['--install-extension', extension.id]);
  
      if(error) {
        console.log(chalk.red("\n❌ VSCode não foi encontrado na sua máquina."));
        process.exit()
      }
  
      if(stdout.toString().trim()){
        extensionInstallLoading.succeed()
      }
      
      if(stderr.toString().trim() && !stderr.toString().includes('DEP0005')){
        extensionInstallLoading.fail();
        console.log(stderr.toString())
      }
      
    }
  } catch (error) {
    fetchLoading.fail();
    console.log(chalk.red("\n❌ Erro ao buscar extensões."));
  }

};

export default runVSCodeCommand
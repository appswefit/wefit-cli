import { AxiosError } from "axios";
import chalk from "chalk";
import keytar from "keytar";

import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import loading from "../../utils/loading";
import promptUser from "../../utils/promptUser";

import { ACCOUNT_NAME, SERVICE_NAME } from "./constants";
import generateIcons from "./generateIcons";

interface IFigmaGenerate {
  userToken?: string;
  filedId?: string;
}

enum ExportSections {
  TOKENS = "Tokens",
  ICONS = "Icons",
  LOGO = "Logo",
  COLORS = "Colors",
  FONTS = "Fonts",
}

export default async function figmaGenerate({
  userToken,
  filedId,
}: IFigmaGenerate) {
  console.log(chalk.yellow("🛠️ Vamos lá!"));
  
  let figmaUserToken = await getFigmaUserToken(userToken);

  const figmaFileId = filedId ?? (await promptUser("Informe o ID do arquivo no Figma"));

  await generateAssets(figmaUserToken, figmaFileId);
}

async function getFigmaUserToken(userToken?: string) {
  let figmaUserToken = userToken ?? await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);

  if (!figmaUserToken) {
    figmaUserToken = await promptUser("Informe o seu token de usuário do Figma");
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, figmaUserToken);
    console.log(chalk.green("Token armazenado com sucesso!"));

    return figmaUserToken;
  }

  console.log(chalk.green("✅ Token recuperado com sucesso!"));

  return figmaUserToken;
}

async function generateAssets(userToken: string, fileId: string) {
  const figmaFetchFileLoading = loading("Buscando arquivo do Figma");
  const figmaClient = new FigmaClient(userToken, fileId);

  try {
    figmaFetchFileLoading.start();
    const data = await figmaClient.getFile();
    figmaFetchFileLoading.stop();

    const pages = data.children as Node<"CANVAS">[];

    for (let index = 0; index < pages.length; index++) {
      const pageNode = pages[index];

      if (pageNode.name === ExportSections.ICONS) {
        const frame = pageNode.children[0] as Node<"FRAME">;
        generateIcons(frame, figmaClient);
      }
    }

    console.log(
      chalk.green("✅ Arquivos gerados com sucesso! Verifique nas pastas styles e assets")
    );
  } catch (error) {
    figmaFetchFileLoading.stop();
    console.log(chalk.redBright("Opss! Algo deu errado."));

    const isAxiosErrorAndTokenExpired = error instanceof AxiosError && error.response?.status === 403;

    if (isAxiosErrorAndTokenExpired) {
      console.log(chalk.yellow("⚠️ Token inválido ou expirado. Vamos atualizar."));
      
      const newToken = await promptUser("Informe o novo token de usuário do Figma");
      await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, newToken);
      console.log(chalk.green("Token atualizado com sucesso! Vamos tentar novamente."));
      
      await generateAssets(newToken, fileId);
    }
  } finally {
    figmaFetchFileLoading.stop();
  }
}

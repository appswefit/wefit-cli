import chalk from "chalk";
import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import loading from "../../utils/loading";
import promptUser from "../../utils/promptUser";
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
  const figmaFetchFileLoading = loading("Buscando arquivo do figma");
  const figmaUserToken =
    userToken ?? (await promptUser("Informe o seu token de usuário do figma"));
  const figmaFileId =
    filedId ?? (await promptUser("Informe o id do arquivo no figma"));

  const figmaClient = new FigmaClient(figmaUserToken, figmaFileId);
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
      chalk.green(
        "✅ Arquivos gerados com sucesso! Verifique nas pastas styles e assets"
      )
    );
  } catch (error) {
    console.log(chalk.redBright("Opss! Algo de errado"));
    console.log(error);
  } finally {
    figmaFetchFileLoading.stop();
  }
}

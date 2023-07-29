import { writeFileSync } from "fs";
import { resolve } from "path";

import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import loading from "../../utils/loading";
import promptUser from "../../utils/promptUser";
import generateFont from "./generateFont";
import generateColor from "./generateColor";
import generateLogo from "./generateLogo";
import chalk from "chalk";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";
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

    const tokensFrame = (data.children[0] as Node<"CANVAS">)
      .children[0] as Node<"FRAME">;

    if (tokensFrame.name !== ExportSections.TOKENS)
      throw new Error("Arquivo Inválido");

    let cssRoot = "";
    let json: Record<string, any> = {};

    for (var figmaNode of tokensFrame.children) {
      if (figmaNode.name === ExportSections.FONTS) {
        const { css, fonts } = generateFont(figmaNode as Node<"FRAME">);
        cssRoot = cssRoot + css;
        json = {
          ...json,
          ...fonts,
        };
      }

      if (figmaNode.name === ExportSections.COLORS) {
        const { css, colors } = generateColor(figmaNode as Node<"FRAME">);
        cssRoot = cssRoot + css;
        json = {
          ...json,
          ...colors,
        };
      }

      if (figmaNode.name === ExportSections.LOGO) {
        const { logos } = await generateLogo(
          figmaNode as Node<"FRAME">,
          figmaClient
        );

        json = {
          ...json,
          logos,
        };
      }

      if (figmaNode.name === ExportSections.ICONS) {
        await generateIcons(figmaNode as Node<"FRAME">, figmaClient);
      }
    }

    const cssFileContent = `:root {${cssRoot}}`;

    const styleFolderDir = handleCreateFolderPath("styles");
    writeFileSync(resolve(styleFolderDir, "global-style.css"), cssFileContent);
    writeFileSync(resolve(styleFolderDir, "config.json"), JSON.stringify(json));
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

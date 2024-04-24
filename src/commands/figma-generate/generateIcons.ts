import util from "util";
import stream from "stream";
const pipeline = util.promisify(stream.pipeline);
import axios from "axios";
import { writeFile } from "fs";
import chalk from "chalk";
import parseSvg from "svgps";

import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import loading from "../../utils/loading";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";
import { resolve } from "path";
import { processPromisesBatch } from "../../utils/processPromisesBatch";
import generateIconTypes from "./generateIconTypes";

type IconGroup = Record<string, string>;

type IconSectionGroup = Record<string, IconGroup>;

type IconList = Array<{
  nodeId: string;
  group: string;
  name: string;
}>;

async function generateIconFolders(
  iconList: IconList,
  images: Record<string, string>
) {
  const iconConfig: Record<string, any> = {};
  let iconNameType = "";

  handleCreateFolderPath(resolve("assets"));
  const iconsFolder = handleCreateFolderPath(resolve("assets", "icons"));
  await processPromisesBatch(iconList,20,async ({group,name,nodeId}) => {
    const image = images[nodeId];
    const { data } = await axios.get(image, {
      responseType: "text",
    });
    const regex: RegExp = /<defs[^>]*>[\s\S]*?<\/defs\s*>/g;
    const svgWithoutDefs: string = data.replace(regex, "");

    const iconJson = parseSvg(svgWithoutDefs, { template: "icomoon" });
    iconConfig[`${group}-${name}`] = iconJson;
    console.log(iconConfig)
  })
  console.log(iconConfig)

  await util.promisify(writeFile)(
    resolve(iconsFolder, "config.json"),
    JSON.stringify(iconConfig)
  );

  await generateIconTypes(iconConfig);
}

export default async function generateIcons(
  figmaNode: Node<"FRAME">,
  figmaClient: FigmaClient
) {
  const loader = loading("Gerando ícones");
  try {
    loader.start();

    const iconToDownload: IconList = [];

    console.log(figmaNode.children.map((el) => el.name));

    const documentNode = figmaNode.children.find(
      (el) => el.name === "document"
    ) as Node<"FRAME">;

    if (!documentNode) {
      throw Error();
    }

    (documentNode.children as Node<"FRAME">[]).forEach((sectionNode) => {
      if (sectionNode.name === "skip") return;
      if (sectionNode.children.length === 0) return;

      (sectionNode.children as Node<"FRAME">[]).forEach((groupNode) => {
        if (groupNode.name === "skip") return;
        if (sectionNode.children.length === 0) return;

        if (groupNode.name === "container") {
          (groupNode.children as Node<"FRAME">[]).forEach((iconNode) => {
            iconToDownload.push({
              group: sectionNode.name,
              nodeId: iconNode.id,
              name: iconNode.name,
            });
          });
        }
      });
    });

    const result = await figmaClient.getNodeUrl(
      iconToDownload.map((el) => el.nodeId)
    );
    await generateIconFolders(iconToDownload, result.images);
    
    console.log(chalk.green("\n✅ Ícones gerados com sucesso!"));
  } catch (error) {
    console.log(error);
    console.log(chalk.red("\n❌ Erro ao gerar ícones"));
    throw new Error("Falha ao gerar ícones");
  } finally {
    loader.stop();
  }
}

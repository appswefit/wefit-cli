import util from "util";
import stream from "stream";
const pipeline = util.promisify(stream.pipeline);
import axios from "axios";
import { createWriteStream, writeFileSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";
import parseSvg from "svgps";

import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import loading from "../../utils/loading";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";

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

  const promises = iconList.map(async ({ nodeId, name, group }) => {
    const image = images[nodeId];

    const { data } = await axios.get(image, {
      responseType: "text",
    });

    const iconGroupFolder = handleCreateFolderPath(resolve(iconsFolder, group));

    await pipeline(
      data,
      createWriteStream(resolve(iconGroupFolder, `${name}.svg`))
    );

    const iconJson = parseSvg(data, { template: "icomoon" });

    iconConfig[`${group}-${name}`] = iconJson;
  });
  await Promise.all(promises);

  writeFileSync(
    resolve(iconsFolder, "config.json"),
    JSON.stringify(iconConfig)
  );
}

export default async function generateIcons(
  figmaNode: Node<"FRAME">,
  figmaClient: FigmaClient
) {
  const loader = loading("Gerando ícones");
  try {
    loader.start();

    const iconToDownload: IconList = [];

    (figmaNode.children as Node<"FRAME">[]).forEach((sectionNode) => {
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
    console.log(chalk.green("\n✅ Ícones gerados com sucesso!"));

    await generateIconFolders(iconToDownload, result.images);
  } catch (error) {
    console.log(chalk.red("\n❌ Erro ao gerar ícones"));
    throw new Error("Falha ao gerar ícones");
  } finally {
    loader.stop();
  }
}

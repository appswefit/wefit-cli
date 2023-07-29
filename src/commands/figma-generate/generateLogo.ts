import util from "util";
import stream from "stream";
const pipeline = util.promisify(stream.pipeline);

import FigmaClient from "../../infra/http/figmaClient";
import { Node } from "../../infra/http/figmaClient.types";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";
import loading from "../../utils/loading";
import axios from "axios";
import { createWriteStream } from "fs";
import { resolve } from "path";
import chalk from "chalk";

async function downloadLogoFiles(
  nodeIds: {
    id: string;
    name: string;
  }[],
  images: Record<string, string>
) {
  const assetsFolder = handleCreateFolderPath("assets");

  const promises = nodeIds.map(async ({ id, name }) => {
    const image = images[id];

    const result = await axios.get(image, {
      responseType: "stream",
    });

    await pipeline(
      result.data,
      createWriteStream(resolve(assetsFolder, `${name}.svg`))
    );
  });

  await Promise.all(promises);
}

export default async function generateLogo(
  figmaNode: Node<"FRAME">,
  figmaClient: FigmaClient
) {
  const loader = loading("Gerando logos");
  try {
    loader.start();
    const nodeIds = (figmaNode.children as Node<"INSTANCE">[]).map(
      (instanceNode) => {
        return { id: instanceNode.id, name: instanceNode.name };
      }
    );

    const result = await figmaClient.getNodeUrl(nodeIds.map((el) => el.id));

    await downloadLogoFiles(nodeIds, result.images);

    return { logos: nodeIds.map((el) => el.name) };
  } catch (error) {
    console.log(chalk.red("\n❌ Erro ao gerar logos"));
    throw new Error("Falha ao gerar logos");
  } finally {
    console.log(chalk.green("\n✅ Logos geradas com sucesso!"));

    loader.stop();
  }
}

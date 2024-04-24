import path, { resolve } from "path";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";
import util from "util";
import { writeFile } from "fs";
import chalk from "chalk";

export default async function generateIconTypes(iconsJson: Record<string, any>) {
    const iconsFolder = handleCreateFolderPath(resolve("assets", "icons"));

    const iconNames = Object.keys(iconsJson).map((icon) => {
        return `"${icon}"`;
    });

    const type =
        "type IconNames = " +
        iconNames.toString().replace(/,/g, " | ") +
        ";" +
        "\n export default IconNames;";

    await util.promisify(writeFile)(
        resolve(iconsFolder, "IconNames.ts"),
        type
    );

    writeFile(iconsFolder, type, () => {
        console.log(chalk.green("\n✅ Tipagem dos icones gerada com sucesso!"));
    });
}
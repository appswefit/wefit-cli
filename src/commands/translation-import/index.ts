import chalk from "chalk";
import { existsSync, writeFileSync } from "fs";

import promptUser from "../../utils/promptUser";
import { resolve } from "path";
import { Workbook } from "exceljs";
import { handleCreateFolderPath } from "../../utils/handleCreateFolderPath";

function setValueByPath(obj: any, path: string, value: any) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current.hasOwnProperty(key) || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

export default async function translationImport() {
  const currentDir = process.cwd();

  console.log(chalk.yellow("🛠️ Vamos lá!"));

  const userFile = await promptUser(
    "Qual o nome do arquivo de traduções? Deixe vazio caso translation.xlsx"
  );

  const filename = userFile || "translation.xlsx";
  const filePath = resolve(currentDir, filename);
  const fileExists = existsSync(filePath);

  if (!fileExists) {
    console.log(
      chalk.red(`❌ Arquivo ${filename} não encontrado no diretório atual`)
    );
    return;
  }

  let workbook = new Workbook();

  workbook = await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet("Traduções");

  const keyColumn = worksheet?.columns[0];
  const languageColumns = worksheet?.columns.slice(1);
  const languages: string[] | undefined = languageColumns && languageColumns
    .filter((el) => !!el.values)
    .map((el) => el.values?.[1] as string);

  let translation: Record<string, any> = {};

  const translationKeys = keyColumn?.values?.slice(2);

  if (languages) {
    languages.forEach((language, languageIndex) => {
      const colPosition = languageIndex + 2;
      const langObj: Record<string, any> = {};
  
      translationKeys?.forEach((el, index) => {
        const rowPosition = index + 2;
        const translationCell = worksheet && worksheet.getCell(rowPosition, colPosition);
        const value = translationCell?.value?.toString() || "";
  
        setValueByPath(langObj, el?.toString() || "", value);
      });
  
      translation[language] = langObj;
    });
  
    const localesFolder = resolve(currentDir, "locales");
  
    handleCreateFolderPath(localesFolder);
  
    languages.forEach((lang) => {
      const languageFolder = resolve(localesFolder, lang.toLocaleLowerCase());
      handleCreateFolderPath(languageFolder);
  
      const translateContent = JSON.stringify(translation[lang]);
      writeFileSync(
        resolve(languageFolder, "translation.json"),
        translateContent
      );
    });
  }
}

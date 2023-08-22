import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { readdir } from "fs/promises";
import { resolve } from "path";
import { Border, Column, Fill, Style, Workbook } from "exceljs";
import _, { isEmpty } from "lodash";

const thinBlackBorder: Partial<Border> = {
  color: {
    argb: "FF000000",
  },
  style: "thin",
};

async function getFoldersOnDir(path: string): Promise<string[]> {
  const folders = (await readdir(path, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => dirent.name !== "pt-br")
    .map((dir) => dir.name);
  return folders;
}

function flattenObject(obj: any, parentKey = "") {
  let result: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        result = result.concat(flattenObject(obj[key], newKey));
      } else {
        result.push(newKey);
      }
    }
  }

  return result;
}

function getValueByPath(obj: any, path: string) {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && value.hasOwnProperty(key)) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

function objectKeys(object: any): string[] {
  return flattenObject(object);
}

export default async function translationExport() {
  const currentDir = process.cwd();
  const localeDir = resolve(currentDir, "locales");
  const localeFolderExists = existsSync(localeDir);
  console.log(chalk.yellow("🛠️ Vamos lá!"));
  console.log(chalk.gray("⏲️ Gerando a planilha de tradução..."));

  if (!localeFolderExists) {
    return console.log(
      chalk.redBright("❌ Pasta locales não encontrada no diretório atual")
    );
  }

  const ptFolder = resolve(localeDir, "pt-br");
  const ptFolderExists = existsSync(localeDir);

  if (!ptFolderExists) {
    return console.log(
      chalk.redBright("❌ Pasta locales/pt não encontrada no diretório atual")
    );
  }

  const workbook = new Workbook();

  const worksheet = workbook.addWorksheet("Traduções", {
    state: "visible",
    views: [
      {
        ySplit: 1,
        state: "frozen",
        xSplit: 2,
      },
    ],
  });

  const headers: Column[] = [
    {
      key: "key",
      header: "CHAVE",
      width: 60,
      protection: {
        locked: true,
      },
      style: {
        alignment: {
          vertical: "top",
        },
      },
    } as Column,
    {
      key: "pt-br",
      header: "PT-BR",
      width: 40,
      collapsed: true,
      alignment: {
        wrapText: true,
        vertical: "top",
      },
      style: {
        alignment: {
          wrapText: true,
          vertical: "top",
        },
      },
    } as Column,
  ];

  const languagesFolders = await getFoldersOnDir(localeDir);

  languagesFolders.forEach((language) => {
    headers.push({
      key: language,
      header: language.toLocaleUpperCase(),
      width: 40,
      collapsed: true,
      alignment: {
        wrapText: true,
        vertical: "top",
      },
      style: {
        alignment: {
          wrapText: true,
          vertical: "top",
        },
      },
    } as Column);
  });

  worksheet.columns = headers;

  const headerStyle: Partial<Style> = {
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "666666",
      },
    } as Fill,
    font: {
      bold: true,
      color: {
        argb: "FFFFFF",
      },
    },
    border: {
      bottom: thinBlackBorder,
      right: thinBlackBorder,
    },
  };

  headers.forEach((_, index) => {
    worksheet.getRow(1).getCell(index + 1).style = headerStyle;
  });

  const ptTranslationFile = readFileSync(
    resolve(ptFolder, "translation.json")
  ).toString();

  const ptTranslation = JSON.parse(ptTranslationFile);

  const keys = objectKeys(ptTranslation);

  keys.forEach((key, index) => {
    const colPosition = worksheet.getColumn("pt-br").number;

    const keyCell = worksheet.getCell(index + 2, 1);

    keyCell.style = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "d9d9d9",
        },
      },
      border: {
        bottom: thinBlackBorder,
        right: thinBlackBorder,
      },
    };
    keyCell.value = key;

    const translationCell = worksheet.getCell(index + 2, colPosition);
    translationCell.border = {
      bottom: thinBlackBorder,
    };
    translationCell.value = getValueByPath(ptTranslation, key);
  });

  languagesFolders.forEach((language, languageIndex) => {
    const languageFolder = resolve(localeDir, language);
    const translationFile = readFileSync(
      resolve(languageFolder, "translation.json")
    ).toString();
    const translation = JSON.parse(translationFile);

    keys.forEach((key, index) => {
      const translationValue = getValueByPath(translation, key);

      const colPosition = worksheet.getColumn(language).number;
      const translationCell = worksheet.getCell(index + 2, colPosition);
      const ptTranslationCell = worksheet.getCell(index + 2, 2);
      const isEmptyTranlsation = !Boolean(translationValue);
      const isEqualPtValue =
        ptTranslationCell.value?.toString() === translationValue;

      translationCell.style = {
        border: {
          bottom: thinBlackBorder,
          ...(languagesFolders.length - 1 === languageIndex && {
            right: thinBlackBorder,
          }),
        },
        alignment: {
          wrapText: true,
          vertical: "top",
        },
        ...(isEqualPtValue && {
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "fff3cc",
            },
          },
        }),
        ...(isEmptyTranlsation && {
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "f5cbcc",
            },
          },
        }),
      };

      translationCell.value = translationValue;
    });
  });

  workbook.xlsx.writeFile(resolve(currentDir, "translation.xlsx"));

  console.log(
    chalk.green(
      "✅ Planilha gerada com sucesso confira o arquivo translation.xlsx"
    )
  );
}

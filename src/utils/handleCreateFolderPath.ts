import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";

export function handleCreateFolderPath(folder: string) {
  const currentDir = process.cwd();
  const styleFolderPath = resolve(currentDir, folder);

  const folderExists = existsSync(styleFolderPath);

  if (!folderExists) mkdirSync(styleFolderPath);

  return styleFolderPath;
}

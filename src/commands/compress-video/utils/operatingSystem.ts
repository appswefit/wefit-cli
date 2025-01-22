import { platform } from 'os';

export type OperatingSystemPlatforms = "win32" | "darwin" | "linux";

export enum OperatingSystem {
  MAC = "darwin",
  LINUX = "linux",
  WIN = "win32"
}

export const platformOS = platform() as OperatingSystemPlatforms;

export const slashFormatByPlatformOS = {
  [OperatingSystem.LINUX]: '/',
  [OperatingSystem.MAC]: '/',
  [OperatingSystem.WIN]: '\\'
}

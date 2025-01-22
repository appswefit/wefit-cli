import { OperatingSystem, OperatingSystemPlatforms } from "./operatingSystem";

export function removeSpecialCharacters(text: string, platformOS: OperatingSystemPlatforms) {
  const operationsByPlatform = {
    [OperatingSystem.MAC]: text.replace(/^'|'|"|"$|\\/g, '').trim(),
    [OperatingSystem.LINUX]: text.replace(/^'|'|"|"$|\\/g, '').trim(),
    [OperatingSystem.WIN]: text.replace(/^'|'|"|"/g, '').trim(),
  }
  
  return operationsByPlatform[platformOS];
}
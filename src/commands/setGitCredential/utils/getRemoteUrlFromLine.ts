import { REGEX, TEXTS } from "../constants";

// Use regex para extrair a URL remota
export const getRemoteUrlFromLine = (firstLine: string) => {
  const remoteUrlMatch = firstLine.match(REGEX.remoteUrlMatch);
  if (!remoteUrlMatch) {
    throw new Error(TEXTS.invalid.remoteUrl);
  }

  return remoteUrlMatch?.[1];
};

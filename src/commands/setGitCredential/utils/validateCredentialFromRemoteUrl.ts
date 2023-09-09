import { REGEX, TEXTS } from "../constants";

export const validateCredentialFromRemoteUrl = (remoteUrl: string) => {
  // Verifique se a URL remota contém uma credencial
  const credentialMatch = remoteUrl?.match(REGEX.credentialMatch);
  if (!credentialMatch) {
    throw new Error(TEXTS.invalid.credentialMatch);
  }

  const [, prefix, , suffix] = credentialMatch;
  return { prefix, suffix };
};

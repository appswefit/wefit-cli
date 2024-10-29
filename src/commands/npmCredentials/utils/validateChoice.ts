import promptUser from "../../../utils/promptUser";
import { TEXTS } from "../../setGitCredential/constants";
import { MESSAGES_NPM_CREDENTIALS } from "../constants";

/**
 * Função que valida a escolha do usuário e retorna a opção escolhida.
 * 
 * @param {string} folderPath - Caminho da pasta.
 * 
 * @returns {Promise<string>} Escolha válida do usuário.
 */
export const validateChoice = async (folderPath = ""): Promise<string> => {
  const VALID_OPTIONS = ["1", "2"];
  let isValidChoice = false;
  let userChoice = "";
  let selectedOption = "";

  while (!isValidChoice) {
    userChoice = await promptUser(MESSAGES_NPM_CREDENTIALS.prompt.getTypePrompt(folderPath));
    isValidChoice = Boolean(userChoice) && VALID_OPTIONS.includes(userChoice);

    if (!isValidChoice) {
      console.log(TEXTS.again);
      continue;
    }

    selectedOption = VALID_OPTIONS.find((option) => option === userChoice) ?? "";
    if (!selectedOption) {
      console.log(TEXTS.again);
      isValidChoice = false;
      continue;
    }

    console.log(MESSAGES_NPM_CREDENTIALS.prompt.goodChoice(selectedOption as "1" | "2"));
  }
  
  return selectedOption;
};

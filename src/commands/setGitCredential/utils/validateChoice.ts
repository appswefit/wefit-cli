import promptUser from "../../../utils/promptUser";
import { FINAL_CHOICE, TEXTS } from "../constants";
import { TextChoice } from "../interface";
import { getText } from "./getTexts";

export const validateChoice = async () => {
  let choice = "";
  let hasChoice = false;
  let chosen: TextChoice | null = null;

  while (!hasChoice) {
    choice = await promptUser(getText.prompt.result());
    hasChoice = Boolean(choice) && FINAL_CHOICE.includes(choice as TextChoice);

    if (!hasChoice) {
      console.log(TEXTS.again);
      continue;
    }

    chosen = FINAL_CHOICE.find((item) => item === choice)!;
    console.log(getText.goodChoice(chosen));
  }
  return chosen;
};

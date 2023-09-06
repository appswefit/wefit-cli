import promptUser from "../../../utils/promptUser";
import { FINAL_CHOICE, TEXTS } from "../constants";
import { TextChoice } from "../interface";

export const validateChoice = async () => {
  let choice = "";
  let hasChoice = false;
  let chosen: TextChoice | null = null;

  while (!hasChoice) {
    choice = await promptUser(TEXTS.promptResult());
    hasChoice = Boolean(choice) && FINAL_CHOICE.includes(choice as TextChoice);

    if (!hasChoice) {
      console.log(TEXTS.again);
    } else {
      chosen = FINAL_CHOICE.find((item) => item === choice)!;
      console.log(TEXTS.goodChoice(chosen));
    }
  }
  return chosen;
};

import input from "@inquirer/input";
import inquirer, { PromptModule } from 'inquirer';


const promptUser = async (message: string): Promise<string> => {
  const answer = await input({ message });

  return answer;
};

export default promptUser;

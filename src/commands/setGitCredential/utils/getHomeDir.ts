import { homedir, userInfo } from "node:os";
import { resolve } from "node:path";

export const getHomeDir = () => {
  return process.env.HOME
    ? resolve(process.env.HOME)
    : (userInfo().homedir ?? homedir()).trim() || "/";
};

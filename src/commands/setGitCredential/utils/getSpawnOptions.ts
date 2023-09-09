import { SpawnSyncOptionsWithStringEncoding } from "node:child_process";

export const getSpawnOptions = (
  cwd: string
): SpawnSyncOptionsWithStringEncoding => ({
  cwd,
  encoding: "utf-8",
  shell: true,
});

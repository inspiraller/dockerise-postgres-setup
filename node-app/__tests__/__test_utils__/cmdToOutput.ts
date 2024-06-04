import { exec } from "child_process";

export const trim = (str: string) =>
  typeof str === "string" ? str.replace(/[\r\n]+$/, "") : str;

export const cmdToOutput = async (script: string) => {
  const execute = exec(script);
  let dataAll = "";
  execute.stdout?.on("data", (data) => {
    dataAll += data;
  });
  return new Promise<string>((resolve, reject) => {
    execute.stdout?.on("end", () => {
      resolve(dataAll);
    });
    execute.on("error", reject);
  });
};
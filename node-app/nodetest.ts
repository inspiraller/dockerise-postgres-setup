import { exec } from "child_process";


const cmdToOutput = async (script: string) => {
  let dataAll = '';
  const execute = exec(script);
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

const main = async () => {
  const hello = await cmdToOutput('echo hello');
  console.log('nodetest result=', hello);

  const xargs = await cmdToOutput('ls | xargs echo');
  console.log('nodetest ls | xargs echo=', xargs);

  const dockerEcho = await cmdToOutput(`docker exec mycontainer echo hello`);
  console.log('nodetest docker echo=', dockerEcho);

  const dockerXargs = await cmdToOutput(`docker exec mycontainer bash -c 'ls' | xargs echo`);
  console.log('nodetest docker xargs=', dockerXargs);
}
main();

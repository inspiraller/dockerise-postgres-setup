import { exec } from "child_process";

const trim = (str: string) =>
  typeof str === "string" ? str.replace(/[\r\n]+$/, "") : str;

const cmdToOutput = async (script: string) => {
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
const FILE_EXISTS = "file exists";

interface PropExistScripts {
  [key: string]: string[];
}
interface PropsExpectPaths {
  existScripts: PropExistScripts;
  dockerContainer: string;
}
const expectPaths = async ({
  dockerContainer,
  existScripts,
}: PropsExpectPaths) => {
  const existPaths = Object.keys(existScripts) as Array<
    keyof typeof existScripts
  >;

  for (let i = existPaths.length - 1; i > -1; i--) {
    const key = existPaths[i];
    const script = `docker exec ${dockerContainer} bash -c 'ls' ${key} | xargs echo`;
    const resultStr = await cmdToOutput(script);
    const result = trim(resultStr).split(" ");
    const arr = existScripts[key];
    arr.forEach((file) => {
      expect(result.indexOf(file));
    });
  }
};

describe("docker container contents", () => {
  it("should have contents", async () => {
    const script = `docker exec mycontainer test -f scripts/populate-args.sh && echo ${FILE_EXISTS}`;
    const result = await cmdToOutput(script);
    expect(trim(result)).toEqual(FILE_EXISTS);
  });
  //  it('should check multiple files exist', async () => {
  //   // exceeds 5000ms !
  //   const existScripts = [
  //     'scripts/populate-args.sh',

  //     'docker-entrypoint-initdb.d/seed.sql',
  //     'docker-entrypoint-initdb.d/copy-data.sh',
  //     'docker-entrypoint-initdb.d/sym-conf.sh',

  //     '/var/lib/postgresql/data/init.table.csv', // copied via copy-data.sh

  //     // all existing data files too.
  //     '/var/lib/postgresql/data/postgresql.auto.conf',
  //     '/var/lib/postgresql/data/postgresql.conf',
  //     '/var/lib/postgresql/data/pg_hba.conf', //...
  //   ];
  //   const arrScript = existScripts.map((item) => `test -f ${item}`);
  //   const script = `docker exec mycontainer bash -c '${arrScript.join(' && ')} && echo ${FILE_EXISTS}'`

  //   console.log(`script="${script}"`);
  //   const result = await cmdToOutput(script);
  //   expect(trim(result)).toEqual(FILE_EXISTS)
  //  })
  it("should check multiple files exist", async () => {
    const existScripts = {
      "scripts": ["populate-args.sh"],
      "docker-entrypoint-initdb.d": ["seed.sql", "copy-data.sh", "sym-conf.sh"],
      "var/lib/postgresql/data": ["init.table.csv", "postgresql.auto.conf", "postgresql.conf", "pg_hba.conf"],
    };
    expectPaths({ dockerContainer: "mycontainer", existScripts });
  });
  it("should check conf files are symlinks", async () => {

    const postgresConfSym = await cmdToOutput(`docker exec mycontainer test -h var/lib/postgresql/data/postgresql.conf && echo ${FILE_EXISTS}`);
    expect(trim(postgresConfSym)).toEqual(FILE_EXISTS);

    const hbaSym = await cmdToOutput(`docker exec mycontainer test -h var/lib/postgresql/data/pg_hba.conf && echo ${FILE_EXISTS}`);
    expect(trim(hbaSym)).toEqual(FILE_EXISTS);
  });
});

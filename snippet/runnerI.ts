import * as readline from "readline";
import { logger } from "./logger";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

export const getLineI = () => {
  return new Promise<string>((resolve) => {
    const cb = (line: string) => {
      rl.off("line", cb);
      logger("IN", line);
      resolve(line);
    };
    rl.on("line", cb);
  });
};

export const sendLineI = (line: string | number) => {
  logger("OUT", "" + line);
  console.log("" + line);
};

/**
 * throw undefined to start the next test
 */
export const runnerI = (test: (...args: number[]) => any) => {
  const main = async () => {
    const line = await getLineI();
    const [T, ...params] = line.split(" ").map((s) => parseInt(s));
    logger("params", T, ...params);

    let testNumber = 1;
    while (testNumber <= T) {
      try {
        logger("------");
        await test(...params);
      } catch (e) {
        if (typeof e !== "undefined") {
          throw e;
        }
      }
      testNumber++;
    }
  };
  main().finally(() => process.exit());
};

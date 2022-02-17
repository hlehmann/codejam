import { logger } from "./logger";
import * as fs from "fs";
import { parseSplitStr, splitStr } from "./string";

let input: string[] = [];

export const loadFile = (file: string) => {
  input = fs.readFileSync(file, "utf8").trim().split("\n");
};

export const loadSample = (txt: string) => {
  input = txt.trim().split("\n");
};

export const loadStdin = () => {
  input = fs.readFileSync(0, "utf8").trim().split("\n");
};

export const getLine = () => input.shift()!;
export const getParsedLine = () => parseFloat(getLine());
export const getSplittedLine = () => splitStr(getLine());
export const getParsedSplitedLine = () => parseSplitStr(getLine());
export const getLines = (n: number) => input.splice(0, n);
export const getParsedLines = (n: number) => getLines(n).map((s) => parseFloat(s));
export const getSplittedLines = (n: number) => getLines(n).map((s) => splitStr(s));
export const getParsedSplitedLines = (n: number) => getLines(n).map((s) => parseSplitStr(s));

export const sendLine = (line: string) => {
  logger("OUT", line);
  console.log(line);
};

export const runner = (test: (...args: number[]) => any) => {
  const line = getLine();
  const [T, ...params] = line.split(" ").map((s) => parseInt(s));
  logger("params", T, ...params);

  let testNumber = 1;
  while (testNumber <= T) {
    let res: string | number | bigint;
    try {
      logger("--- test #" + testNumber + " ---");
      res = test(...params);
    } catch (e) {
      if (typeof e === "string" || typeof e === "number" || typeof e === "bigint") {
        res = e;
      } else {
        throw e;
      }
    }
    sendLine(`Case #${testNumber}: ${res}`);
    testNumber++;
  }
};

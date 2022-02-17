import * as fs from "fs";

export const cleanLog = () => {
  fs.writeFileSync("log.txt", "\n\n\n\n\n");
};

cleanLog();

export const writeLog = (message: string) => {
  fs.appendFileSync("log.txt", message + "\n");
};

export const logger = (...messages: any[]) => {
  // console.log(...messages)
  writeLog(messages.map((s) => JSON.stringify(s)).join(" "));
};

export const loggerStr = (...messages: any[]) => {
  // console.log(...messages)
  writeLog(messages.join(" "));
};

export const arrLogger = (values: any[]) => writeLog(values.map((s) => s).join(" "));
export const tableLogger = (values: any[][]) => writeLog(values.map((v) => v.map((s) => s).join(" ")).join("\n"));

export const devRunner = (cb: () => any) => {
  cb();
};

import * as fs from "fs"

export const cleanLog = () => {
  fs.writeFileSync('log.txt', '');
}

cleanLog();

export const logger = (...messages: any[]) => {
  // console.log(...messages)
  fs.appendFileSync(
    "log.txt",
    messages.join(" ") + "\n"
  );
};

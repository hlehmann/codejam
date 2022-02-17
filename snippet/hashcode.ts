import { loadFile } from "./runner";
import { logger } from "./logger";
import * as fs from "fs";

type Dataset = { name: string };
type State = { score: number; stats: { cpt?: number } };

export type HashcodeLoader = <D extends Dataset, S extends State>(dataSet: D) => S;
export type HashcodeSave = (score: number, output: string) => void;

export interface HashcodeOptions<D extends Dataset, S extends State> {
  dataSet: D;
  load: (dataSet: D) => S;
  clone?: (state: S) => S;
  iterate?: (state: S, dataSet: D) => S | void;
  print: (state: S, dataSet: D) => string;
  __dirname: string;
}

export const hashcodeRunner = <D extends Dataset, S extends State>({
  dataSet,
  load,
  clone,
  iterate,
  print,
  __dirname,
}: HashcodeOptions<D, S>) => {
  const name = dataSet.name;
  logger(name);

  if (!fs.existsSync(__dirname + "/out/")) {
    fs.mkdirSync(__dirname + "/out/");
  }
  const outputFile = __dirname + "/out/" + name.replace(".in", ".out");
  const emit = (state: S) => {
    const output = print(state, dataSet);
    fs.writeFileSync(outputFile, output, "utf8");
  };

  loadFile(__dirname + "/in/" + name);
  let bestState = load(dataSet);
  let cpt = 0;
  bestState.stats.cpt = 0;
  emit(bestState);
  let nextPrint = Date.now() + 5000;
  if (iterate) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const clonedState = clone ? clone(bestState) : bestState;
      clonedState.stats.cpt = cpt;
      const newState = iterate(clonedState, dataSet) || clonedState;

      if (newState.score > bestState.score) {
        bestState = newState;
      }
      if (Date.now() > nextPrint) {
        nextPrint += 5000;
        emit(bestState);
        logger(bestState.score, bestState.stats);
      }
      cpt++;
    }
  } else {
    print(bestState, dataSet);
  }
};

export const combineNexts = (...nexts: (() => () => void)[]) => {
  return () => {
    const reverts = nexts.map((next) => next());
    return () => reverts.reverse().forEach((revert) => revert());
  };
};

import { runner, getParsedLine, loadSample, loadStdin, getParsedSplitedLine } from "../snippet/runner";
import { findMinIndex } from "../snippet/array";
import { logger } from "../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d0a5c

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`3
4
4 2 1 3
2
1 2
7
7 6 5 4 3 2 1
`);

const test = () => {
  const N = getParsedLine();
  const L = getParsedSplitedLine();
  let cost = 0;
  let list = L;

  for (let i = 0; i < N - 1; i++) {
    const j = i + findMinIndex(list.slice(i));
    const sub = list.slice(i, j + 1);
    const newList = [...list.slice(0, i), ...sub.reverse(), ...list.slice(j + 1)];
    logger(list.join(), i, j, sub);
    cost += j - i + 1;
    list = newList;
  }
  logger(list.join());

  return cost;
};

runner(test);

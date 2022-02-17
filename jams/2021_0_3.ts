import { runner, loadSample, loadStdin, getParsedSplitedLine } from "../snippet/runner";
import { findMinIndex, range } from "../snippet/array";
import { logger } from "../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d12d7

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`1
7 23
2 1
7 12
7 2
2 1000
`);

const test = () => {
  const [N, C] = getParsedSplitedLine();

  if (C > (N * (N + 1)) / 2 - 1 || C < N - 1) return "IMPOSSIBLE";

  let result = range(N).map((i) => i + 1);
  let remaining = C - (N - 1);
  let operations = 0;
  for (let i = N - 1; i > 0; i--) {
    if (remaining >= i) {
      const offset = Math.floor(operations / 2);
      logger(result, i, offset);
      const newResult = [
        ...result.slice(0, offset),
        ...result.slice(offset, i + 1 + offset).reverse(),
        ...result.slice(i + 1 + offset),
      ];
      result = newResult;
      operations++;
      remaining -= i;
    }
  }

  logger(result);
  let list = [...result];

  let cost = 0;
  for (let i = 0; i < list.length - 1; i++) {
    const j = i + findMinIndex(list.slice(i));
    const sub = list.slice(i, j + 1);
    const newList = [...list.slice(0, i), ...sub.reverse(), ...list.slice(j + 1)];
    logger(list, i, j, sub);
    cost += j - i + 1;
    list = newList;
  }
  logger(list.join());
  logger(cost, C);

  return result.join(" ");
};

runner(test);

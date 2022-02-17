import { runner, loadSample, loadStdin, getSplittedLine } from "../snippet/runner";
import { logger } from "../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d1145

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`4
2 3 CJ?CC?
4 2 CJCJ
1 3 C?J
2 5 ??J???`);

const test = () => {
  const [x, y, L] = getSplittedLine();
  const X = parseFloat(x);
  const Y = parseFloat(y);
  logger(X, Y, L);

  let cost = 0;
  let prev = "?";
  for (let i = 0; i < L.length; i++) {
    logger(prev, L[i]);
    if (L[i] === "?") continue;
    if (L[i] === prev) continue;
    if (prev !== "?") {
      cost += L[i] === "J" ? X : Y;
    }
    prev = L[i];
  }

  return cost;
};

runner(test);

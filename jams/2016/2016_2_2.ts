import { loadStdin, loadSample, runner, getParsedSplitedLine } from "../../snippet/runner";
import { logger, devRunner, tableLogger } from "../../snippet/logger";
import { range } from "../../snippet/array";
import { formatFloat } from "../../snippet/string";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000201c91/0000000000201b71

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`4
2 2
0.75 0.75
4 2
0.00 0.00 1.00 1.00
3 2
0.75 1.00 0.50
4 4
0.5 0.75 0.5 0.75`);

devRunner(() => {
  const arr = range(10).map((i) => i / 10);
  const probs = arr.map((p1) => arr.map((p2) => formatFloat(p1 * (1 - p2) + p2 * (1 - p1), 2)));
  tableLogger(probs);
});

const test = () => {
  const [N, K] = getParsedSplitedLine();
  logger(N, K);
  const P = getParsedSplitedLine();
  P.sort();
  logger(P);

  const initialProbs: number[] = new Array(N).fill(0);
  initialProbs[0] = 1;

  const probsReducer = (probs: number[], pi: number) =>
    probs.map((prob, y) => (y === 0 ? prob * (1 - pi) : prob * (1 - pi) + probs[y - 1] * pi));

  let res = 0;

  range(K + 1).forEach((i) => {
    const sub1 = P.slice(0, i);
    const sub2 = P.slice(N - K + i);
    const probs = [...sub1, ...sub2].reduce(probsReducer, initialProbs);
    const prob = probs[K / 2];
    logger(sub1, sub2, prob);
    if (prob > res) res = prob;
  });

  return res;
};

runner(test);

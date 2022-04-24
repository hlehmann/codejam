import { loadStdin, loadSample, runner, getParsedSplitedLine, getParsedSplitedLines } from "../../snippet/runner";
import { range } from "../../snippet/array";
import { logger } from "../../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019ffb9/000000000033871f

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`3
4 4
-1 -3 -2
1 2
1 3
2 4
3 4
4 4
-1 -1 -1
1 4
1 2
1 3
2 3
3 2
-2 -1
2 3
1 3`);

const test = () => {
  // not working
  const [C, D] = getParsedSplitedLine();
  const X = [[], ...getParsedSplitedLine().map((x) => -x)];
  const DD = getParsedSplitedLines(D);
  logger(C, D, DD);

  const arr = range(C);

  const links: number[][][] = arr.map(() => []);
  DD.map(([i, j], d) => {
    links[i - 1].push([j - 1, d]);
    links[j - 1].push([i - 1, d]);
  });

  const Y = range(D).map(() => 1);
  const last = arr.map(() => Infinity);
  const origin: number[][] = arr.map(() => []);
  last[0] = 0;

  let good = false;
  while (!good) {
    last.forEach((value, i) => {
      if (value === Infinity) return;
      const ls = links[i];
      ls.forEach(([j, d]) => {
        const nextValue = value + Y[d];
        if (nextValue < last[j]) {
          last[j] = nextValue;
          origin[j] = [...origin[i], j];
        }
      });
    });

    good = true;
    X.forEach((x, i) => {
      if (origin[i].length !== x) {
        good = false;
        const j = origin[i].pop();
        const [, d] = links[i].find((l) => l[0] === j)!;
        Y[d]++;
      }
    });
  }

  return Y.join(" ");
};

runner(test);

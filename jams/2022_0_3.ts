import { getParsedLine, getParsedSplitedLine, loadSample, loadStdin, runner } from "../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000876ff1/0000000000a46471

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`4
4
6 10 12 8
6
5 4 5 4 4 4
10
10 10 7 6 7 4 4 5 7 4
1
10`);

const test = () => {
  const N = getParsedLine();
  const S = getParsedSplitedLine();
  const SS = [...S].sort((a, b) => a - b);

  let x = 0;
  for (const s of SS) {
    if (s > x) {
      x++;
    }
  }

  return x;
};

runner(test);

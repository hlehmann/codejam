import { runner, getParsedLine, getParsedSplitedLines, loadSample, loadStdin } from "../snippet/runner";
import { range, checkDistinctInt } from "../snippet/array";
import { getColumn } from "../snippet/matice";

//https://codingcompetitions.withgoogle.com/codejam/round/000000000019fd27/0000000000209a9f

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`3
4
1 2 3 4
2 1 4 3
3 4 1 2
4 3 2 1
4
2 2 2 2
2 3 2 3
2 2 2 3
2 2 2 2
3
2 1 3
1 3 2
1 2 3`);

const test = () => {
  const N = getParsedLine();
  const M = getParsedSplitedLines(N);
  const arr = range(N);

  const k = arr.reduce((s, i) => s + M[i][i], 0);
  const r = arr.reduce((s, i) => s + checkDistinctInt(M[i]), 0);
  const c = arr.reduce((s, j) => s + checkDistinctInt(getColumn(M, j)), 0);

  return `${k} ${r} ${c}`;
};

runner(test);

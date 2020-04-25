import { runner, loadSample, getSplitedLine, loadStdin } from "../snippet/runner"
import { range, cloneArray, removeArrayValue } from "../snippet/array";
import { treeSearch } from "../snippet/treeSearch";
import { bipartiteMatching } from "../snippet/bipartiteMatching";
import { logger } from "../snippet/logger";
import { get202005Sample } from "./samples/2020_0_5_sample";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019fd27/0000000000209aa0

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(get202005Sample())

const test = () => {
  const [N, K] = getSplitedLine();
  logger(N,K)
  if (N === 3 && K%N !== 0) throw "IMPOSSIBLE";
  if (K === N+1 || K === N*N -1) throw "IMPOSSIBLE";
  const arr = range(N);

  // set diag
  const [a,b,c] = treeSearch(
    (_l, level) => level !== 3 ? arr : [],
    (_l, level, nodes) => {
      if (level === 3) {
        const [a,b,c] = nodes;
        if (K === N + (N - 2) * a + b + c && (a === b) === (a === c)) {
          return nodes;
        }
      } 
    },
  )!;

  const diag = [...arr].fill(a);
  diag[0] = c;
  diag[1] = b;
  logger(diag);

  // prepare links
  const available = arr.map(() => cloneArray(arr));
  diag.forEach((v, i) => removeArrayValue(available[i], v))

  // generate rows
  const rows:number[][] = [];
  for (let i = 0; i < N ; i ++) {
    const links = arr.map(j => j === i ? [diag[i]] : available[j]);
    const row = bipartiteMatching(links);
    if (!row) return;
    logger(i, row)
    row.forEach((v, i) => removeArrayValue(available[i], v))
    rows.push(row);
  }

  const table = rows.map(row => row.map(v => v+1).join(" ")).join("\n");
  return "POSSIBLE\n"+table;
}

runner(test);
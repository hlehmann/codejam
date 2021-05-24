import { logger } from "../snippet/logger";
import { loadStdin, loadSample, runner, getLine, getParsedLine, getParsedSplitedLine } from "../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/00000000004362d7/00000000007c0f00

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`5
3 10
1 2 10
3 10
1 3 7
4 10
4 1 7 3
4 3
1 2 3 2
4 4
1 2 4 2`);

interface Interval {
  from: number;
  to: number;
  win1: number;
  win2: number;
}

const test = () => {
  const [N, K] = getParsedSplitedLine();
  const P = getParsedSplitedLine();
  const PP = [...P];
  PP.sort((a,b) => a - b);
  logger(PP)
  const intervals:Interval[] = [];
  const first = PP[0];
  if (first !== 1) {
    intervals.push({
      from: 1,
      to: first-1,
      win1: first-1,
      win2: first-1,
    })
  }
  const last = PP[N - 1];
  if (last !== K) {
    intervals.push({
      from: last+1,
      to: K,
      win1: K - last,
      win2: K - last,
    })
  }
  for (let i = 0; i < N  - 1 ; i++) {
    const from = PP[i]+1;
    const to = PP[i+1]-1;
    logger(from, to);
    if (to < from) continue;
    intervals.push({
      from, 
      to,
      win1: Math.ceil((to-from+1)/2),
      win2: to - from + 1
    })
  }

  intervals.sort((a, b) => b.win1 - a.win1);
  const win1 = intervals.slice(0, 2).map(interval => interval.win1).reduce((a, n) => a+n,0);
  intervals.sort((a, b) => b.win2 - a.win2);
  const win2 = intervals[0] ? intervals[0].win2 : 0;
  const win = Math.max(win1, win2);

  logger(intervals)

  return win/K
};

runner(test);

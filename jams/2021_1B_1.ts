import { visitParameterList } from "../node_modules/typescript/lib/typescript";
import { range } from "../snippet/array";
import { logger } from "../snippet/logger";
import {
  runner,
  loadSample,
  getParsedSplitedLine,
  loadStdin,
} from "../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000435baf/00000000007ae694

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`3
0 0 0
0 21600000000000 23400000000000
1476000000000 2160000000000 3723000000000
`);

const K = 10 ** 9;
const check = (n: number) => n >= 0 && Number.isInteger(n);

const test = () => {
  let [A, B, C] = getParsedSplitedLine();

  const cases = [
    [A, B, C],
    [A, C, B],
    [B, A, C],
    [B, C, A],
    [C, A, B],
    [C, B, A],
  ];

  for (let [a, b, c] of cases) {
    for (let m of range(60)) {
      for (let s of range(60)) {
        const n = (708 * K * s - c - 720 * K * m + b) / 708;
        if (!check(n)) continue;
        const r = 720 * n + 720 * K * s - c;
        if (!check(r)) continue;
        // const s = (c + r - 720 * n) / (720 * K);
        // if (!check(s)) continue;
        // const m = (b + r - 12 * n - 12 * K * s) / (720 * K);
        // if (!check(m)) continue;
        const h = (a + r - n - K * s - 60 * K * m) / (3600 * K);
        if (!check(h)) continue;
        return [h, m, s, n].join(" ");
      }
    }
  }
};

runner(test);

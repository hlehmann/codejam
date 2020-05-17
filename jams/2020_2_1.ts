
import { loadStdin, loadSample, runner, getLine } from "../snippet/runner";
import { binarySearchBigInt, binarySearchInt } from "../snippet/binarySearch";
import { logger, loggerStr } from "../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019ffb9/00000000003384ea

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`3
1 2
2 2
8 11
100000000000000000 200000000000000000`)

const I = BigInt(2 * Math.pow(10, 9));

const test = () => {
  let [L, R] = getLine().split(" ").map(s => BigInt(s));
  let reversed = R > L;
  if (reversed) [L,R] = [R,L];

  let diff = L - R;
  
  loggerStr("a", 0, diff, L, R);

  let i = binarySearchBigInt(0n, I, (i => {
    const c = i * (i+1n) / 2n
    return c <= diff;
  }))

  const c1 = i * (i+1n) / 2n;
  
  L -= c1;
  diff -= c1;
  if (diff===0n) reversed = false;

  loggerStr("b", i, diff, L, R);

  let j = binarySearchBigInt(0n, I, (j => {
    const cL = j * (i + j);
    const cR = j * (i + j + 1n);
    loggerStr(j, cL, cR);
    return cR <= R;
  }))
  const cL = j * (i + j);
  const cR = j * (i + j + 1n);
  i += 2n*j;
  L -= cL;
  R -= cR;
  loggerStr("c", i, diff, L, R, j);
  if (L >= i+1n) {
    i++;
    L -= i;
  }
  if (reversed) [L,R] = [R,L];
  return `${i} ${L} ${R}`;
}

runner(test);
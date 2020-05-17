import { loadStdin, loadSample, runner, getSplitedLine, getLine, getParsedLine, getSplitedLines } from "../snippet/runner";
import { logger, devRunner, tableLogger } from "../snippet/logger";
import { range, excludeArray, groupValues, findIndexes, findIntersect} from "../snippet/array";
import { formatFloat } from "../snippet/string";
import { reverseMatrice, formatCharMatrice, getRow, getColumn } from "../snippet/matice";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000007706/0000000000045875

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`4
2
1 2
2 1
2
1 1
2 1
2
1 2
1 2
2
2 2
-2 2`)

const test = () => {
  // not working
  const N = getParsedLine();
  const A = getSplitedLines(N);
  logger(N,A)

  const arr = range(N);
  const costumes = [...arr.map(i => i+1), ...arr.map(i => -i - 1)];
  
  const availableCs = arr.map(c => excludeArray(costumes, getColumn(A, c)))


  let res = 0;

  arr.map((r) => {
    const row = getRow(A, r);
    const availableR = excludeArray(costumes, row);
    const groups = groupValues(row);
    groups.forEach(([value, cs]) => {
      if (cs.length === 1) return;
      let minC = 0;
      let minCpt = Infinity;
      cs.forEach(c => {
        const cpt = findIndexes(getColumn(A, c), value).length;
        if (cpt < minCpt) {
          minCpt = cpt;
          minC = c;
        }
      })
      cs.forEach(c => {
        if (c === minC) return;
        const [value, rr, cc] = findIntersect(availableR, availableCs[c])!;
        res++;
        A[r][c] = value;
        availableR.splice(rr, 1)
        availableCs[c].splice(cc, 1)
      })
    })
  })


  logger("c", availableCs);

  arr.map((c) => {
    const col = getColumn(A, c);
    const groups = groupValues(col);
    groups.forEach(([_value, rs]) => {
      if (rs.length === 1) return;
      rs.forEach(r => {
        if (r === 0) return;
        const row = getRow(A, r);
        const availableR = excludeArray(costumes, row);
        const [value, rr, cc] = findIntersect(availableR, availableCs[c])!;
        res++;
        A[r][c] = value;
        availableR.splice(rr, 1)
        availableCs[c].splice(cc, 1)
      })
    })
  })

  return res;
}

runner(test);''
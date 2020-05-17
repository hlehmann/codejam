import { loadStdin, loadSample, runner, getSplitedLine, getParsedLine } from "../snippet/runner";
import { logger } from "../snippet/logger";
import { reverseMatrice, formatCharMatrice } from "../snippet/matice";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000007706/00000000000459f2

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`5
4
1 1 1 1
3
0 2 1
6
3 0 0 2 0 1
6
3 2 0 0 0 1
6
1 0 0 0 2 3`)

const test = () => {
  const C = getParsedLine();
  const B = getSplitedLine();
  logger(C,B)

  if (B[0] === 0 || B[C-1] === 0) throw "IMPOSSIBLE";
  
  let rest = 0;

  let columns = B.map((b,i) => {
    logger(".", i, rest, b)

    const prev = rest;
    rest = rest + 1 - b;

    if (prev < 0) return "/".repeat(-prev);
    if (rest > 0) return "\\".repeat(rest);
    return ""
  })
  logger("stack", rest);
  if (columns[C-1] !== "") throw "IMPOSSIBLE"

  const rows = Math.max(...columns.map(c => c.length)) + 1;
  columns = columns.map(c => c += ".".repeat(rows - c.length));

  const table = formatCharMatrice(reverseMatrice(columns.map(s => Array.from(s))));
  logger(rows, table);
  return rows+"\n"+table;
}

runner(test);''
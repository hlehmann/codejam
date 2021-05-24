import { runner, loadSample, getParsedSplitedLine, loadStdin } from "../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019fef2/00000000002d5b62

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`4
2 3
-2 -3
3 0
-1 1`)

const test = () => {
  let [x, y] = getParsedSplitedLine();

  if (Math.abs(x + y) % 2 === 0) {
    throw "IMPOSSIBLE";
  }

  let result = "";
  // calc last jump
  let i = Math.floor(Math.log2(Math.abs(x) + Math.abs(y)));
  while(i >= 0) {
    const jump = Math.pow(2, i);
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) {
        result = "E"+result;
        x -= jump
      } else {
        result = "W"+result;
        x += jump;
      }
    } else {
      if (y > 0) {
        result = "N"+result;
        y -= jump
      } else {
        result = "S"+result;
        y += jump;
      }
    }
    i--;
  }
  
  return result;
}

runner(test);
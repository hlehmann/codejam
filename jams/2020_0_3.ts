import { runner, getParsedLine, getSplitedLines, loadSample, loadStdin } from "../snippet/runner"

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019fd27/000000000020bdf9

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`4
3
360 480
420 540
600 660
3
0 1440
1 3
2 4
5
99 150
1 100
100 301
2 5
150 250
2
0 720
720 1440`)

const test = () => {
  const N = getParsedLine();
  const M = getSplitedLines(N).map((value, index) => [index, ...value]);
  M.sort((a,b) => a[1]-b[1]);
  
  let C = 0;
  let J = 0;
  let res:string[] = [];
  M.forEach(([index, start, end]) => {
    if (start >= C) {
      res[index] = "C";
      C = end;
    } else if (start >= J) {
      res[index] = "J";
      J = end;
    } else {
      throw "IMPOSSIBLE"
    }
  })

  return res.join("");
}

runner(test);
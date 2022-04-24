import { getParsedSplitedLine, loadSample, loadStdin, runner } from "../../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000876ff1/0000000000a4621b

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`3
3 4
2 2
2 3
`);

const test = () => {
  const [R, C] = getParsedSplitedLine();
  const line = ["+"];
  const cells = ["|"];
  for (let c = 0; c < C; c++) {
    line.push("-", "+");
    cells.push(".", "|");
  }
  const sol = [];
  sol.push(".." + line.join("").substring(2));
  sol.push(".." + cells.join("").substring(2));

  for (let r = 1; r < R; r++) {
    sol.push(line.join(""));
    sol.push(cells.join(""));
  }

  sol.push(line.join(""));

  return `\n${sol.join("\n")}`;
};

runner(test);

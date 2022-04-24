import { loadStdin, loadSample, runner, getParsedSplitedLine } from "../../snippet/runner";
import { logger } from "../../snippet/logger";

// https://codingcompetitions.withgoogle.com/codejam/round/0000000000201c91/0000000000201d1e

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`4
1 1 1 0
1 2 0 0
2 1 1 2
2 2 0 2`);

const test = () => {
  const [N, R, P, S] = getParsedSplitedLine();
  logger(N, R, P, S);

  type Node = [string, string]; // player, root players
  const line: Node[] = [
    ...new Array(P).fill(["P", "P"] as Node),
    ...new Array(R).fill(["R", "R"] as Node),
    ...new Array(S).fill(["S", "S"] as Node),
  ];

  const sortStacks = (a: any[], b: any[]) => b.length - a.length;
  const getRes = (a: string, b: string) => {
    if (a > b) {
      [b, a] = [a, b];
    }
    if (a === "P" && b === "R") return "P";
    if (a === "P" && b === "S") return "S";
    if (a === "R" && b === "S") return "R";
    return "";
  };

  const checkRound = (line: Node[]): string => {
    if (line.length === 0) return "";
    if (line.length === 1) return line[0][1];
    const cpt = line.length;
    const PP = line.filter((node) => node[0] === "P");
    const RR = line.filter((node) => node[0] === "R");
    const SS = line.filter((node) => node[0] === "S");

    const stacks = [PP, RR, SS].sort(sortStacks);

    if (stacks[0].length > cpt / 2) throw "IMPOSSIBLE";

    const children: Node[] = [];
    while (stacks[0].length) {
      const a = stacks[0].pop()!;
      const b = stacks[1].pop()!;
      const res = getRes(a[0], b[0]);
      const ori = [a[1], b[1]].sort().join("");
      children.push([res, ori]);
      stacks.sort(sortStacks);
    }

    return checkRound(children);
  };

  return checkRound(line);
};

runner(test);

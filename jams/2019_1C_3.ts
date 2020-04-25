import { loadSample, runner, getSplitedLine, getLines, loadStdin } from "../snippet/runner";
import { getColumn } from "../snippet/matice";
import { logger } from "../snippet/logger";
import { nimSum, getArrayMEX } from "../snippet/nim";

// https://codingcompetitions.withgoogle.com/codejam/round/00000000000516b9/0000000000134cdf

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`7
2 2
..
.#
4 4
.#..
..#.
#...
...#
3 4
#.##
....
#.##
1 1
.
1 2
##
3 3
...
...
...
10 10
..........
..........
..........
..........
..........
..........
..........
..........
..........
..........`);


type Move = ["H"|"V", number] 
type Box = [number, number, number, number]; 

const test = () => {
  let [R, C] = getSplitedLine();
  const radioactive = getLines(R).map((line) => line.split("").map((s) => s === "#"));
  const cache = new Map<string, number>()

  const getBoxKey = (box: Box) => box.join(".");

  const getAvailableMoves = (box:Box) => {
    const [r1, r2, c1, c2] = box;
    if (r1 === r2 || c1 === c2) return [];
    const available:Move[] = [];
    for (let r = r1; r < r2; r++) {
      if (!radioactive[r].slice(c1,c2).includes(true)) {
        available.push(["H", r])
      }
    }
    for (let c = c1; c < c2; c++) {
      if (!getColumn(radioactive, c).slice(r1,r2).includes(true)) {
        available.push(["V", c])
      }
    }
    return available;
  };

  const getMoveNimber = (move: Move, box: Box):number => {
    const [r1, r2, c1, c2] = box;

    const [type, x] = move;
    const sub1:Box = type==="H" 
      ? [r1, x, c1, c2]
      : [r1, r2, c1, x] 
    const sub2:Box = type==="H" 
      ? [x+1, r2, c1, c2] 
      : [r1, r2, x+1, c2]

    const nimber = nimSum(getNimber(sub1), getNimber(sub2));
    return nimber;
  }

  const getNimber = (box:Box): number => {
    const [r1, r2, c1, c2] = box;
    if (r1 === r2 || c1 === c2) return 0;
    const key = getBoxKey(box);
    const fromCache = cache.get(key);
    if (fromCache !== undefined) return fromCache;

    const moves = getAvailableMoves(box);
    const nimbers = moves.map(move => getMoveNimber(move, box))
    const nimber = getArrayMEX(nimbers);
    
    logger(key, nimber);
    cache.set(key, nimber);
    return nimber;
  }

  let res = 0; 
  const box:Box = [0, R, 0, C];
  const moves = getAvailableMoves(box);
  moves.forEach(move => {
    const nimber = getMoveNimber(move, box)
    if (nimber === 0) {
      res += move[0] === "H" ? C : R;
    } 
    logger(move, nimber);
  })

  return res;
}

runner(test);
import { runnerI, sendLineI, getLineI } from "../snippet/runnerI"
import { findOneAsync } from "../snippet/array";
import { binarySearchIntAsync } from "../snippet/binarySearch";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019fef2/00000000002d5b63

const test = async () => {
  const S = Math.pow(10, 9);
  const s = Math.floor(S / 3);

  const testCoords = async (x:number, y: number) => {
    sendLineI(x+" "+y);
    const res = await getLineI();
    if (res === "CENTER") throw undefined;
    if (res === "HIT") return true;
    return false;
  };
  
  const starts = [[-s, -s],[s, -s],[-s, s],[s, s]];

  // find matching point
  const res = await findOneAsync(starts, ([x,y]) => testCoords(x, y));
  const [x, y] = res!;

  // find boundaries
  const right = await binarySearchIntAsync(x, S, (xx) => testCoords(xx, y));
  const left = await binarySearchIntAsync(x, -S, (xx) => testCoords(xx, y));
  const top = await binarySearchIntAsync(y, S, (yy) => testCoords(x, yy));
  const bottom = await binarySearchIntAsync(y, S, (yy) => testCoords(x, yy));

  testCoords((right + left)/2, (top + bottom) / 2);
}

runnerI(test);
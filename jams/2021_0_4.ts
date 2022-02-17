import { logger } from "../snippet/logger";
import { runnerI, sendLineI, getLineI } from "../snippet/runnerI";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000043580a/00000000006d1284

const test = async (N: number, Q: number) => {
  logger(N, Q);

  const checkPosition = async (n: number, a: number, b: number) => {
    sendLineI([a, b, n].join(" "));
    const res = parseFloat(await getLineI());
    if (res === -1) throw new Error("Wrong answer");
    return res === a ? -1 : res === b ? 1 : 0;
  };

  const insert = async (n: number, i: number, j: number) => {
    if (j - i === 1) return list.splice(i + 1, 0, n);
    const delta = Math.round((j - i) / 3);
    const ii = Math.min(i + delta, n - 3);
    const jj = Math.min(i + 2 * delta, n - 2);
    logger(i, ii, jj, j);
    const res = await checkPosition(n, list[ii], list[jj]);
    logger(res);
    if (res === -1) await insert(n, i, ii);
    else if (res === 1) await insert(n, jj, j);
    else await insert(n, ii, jj);
  };

  const list = [1, 2];
  for (let n = 3; n <= N; n++) {
    logger(list, n);
    await insert(n, -1, list.length);
  }

  sendLineI(list.join(" "));
  await getLineI();
};

runnerI(test);

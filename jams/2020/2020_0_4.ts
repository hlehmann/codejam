import { runnerI, sendLineI, getLineI } from "../../snippet/runnerI";

// https://codingcompetitions.withgoogle.com/codejam/round/000000000019fd27/0000000000209a9e

const test = async (B: number) => {
  let table = new Array(B).fill(0);
  let r = 0;

  const getBit = async (i: number) => {
    sendLineI(i + 1);
    const s = await getLineI();
    r++;
    return parseInt(s);
  };

  const loadBits = async (i: number) => {
    table[i] = await getBit(i);
    table[B - 1 - i] = await getBit(B - 1 - i);
  };

  await loadBits(0);
  const initial = table[0] === table[B - 1];

  let current = initial;
  let i = 1;
  while (current === initial) {
    if (i >= B / 2) {
      sendLineI(table.join(""));
      throw undefined;
    }
    if (r % 10 === 0) {
      const b0 = await getBit(0);
      await getBit(0);
      if (b0 !== table[0]) {
        table = table.map((b) => 1 - b);
      }
    }
    await loadBits(i);
    current = table[i] === table[B - 1 - i];
    i++;
  }

  const j = i - 1;
  while (i < B / 2) {
    if (r % 10 === 0) {
      const b0 = await getBit(0);
      const bj = await getBit(j);
      if (b0 === table[0] && bj === table[j]) {
        //
      } else if (b0 !== table[0] && bj !== table[j]) {
        table = table.map((b) => 1 - b);
      } else if (b0 === table[B - 1]) {
        table = table.reverse();
      } else {
        table = table.reverse();
        table = table.map((b) => 1 - b);
      }
    }
    await loadBits(i);
    i++;
  }
  sendLineI(table.join(""));
};

runnerI(test);

import { treeSearch } from "./treeSearch";

export const bipartiteMatching = (linksA: number[][]) => {
  const n = linksA.length;
  const matchingA: number[] = new Array(n);
  const matchingB: number[] = new Array(n);

  for (let i = 0; i < linksA.length; i++) {
    // find augmenting flow
    const testedB: boolean[] = [];
    const flow = treeSearch(
      (last, level) => {
        const j = last ?? i;
        const isA = level % 2 === 0;
        if (isA) {
          // is there any available ?
          const jj = linksA[j].find((jj) => matchingB[jj] === undefined);
          return jj !== undefined ? [jj] : linksA[j];
        } else {
          if (testedB[j]) return [];
          testedB[j] = true;
          return [matchingB[j]];
        }
      },
      (last, level, flow) => {
        if (level % 2 === 1 && matchingB[last] === undefined) {
          return flow;
        }
      }
    )!;

    if (!flow) return;

    // update matching
    flow.unshift(i);
    for (let k = 0; k < flow.length; k += 2) {
      const a = flow[k];
      const b = flow[k + 1];
      matchingA[a] = b;
      matchingB[b] = a;
    }
  }

  return matchingA;
};

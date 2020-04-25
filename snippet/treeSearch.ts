import { getLast } from "./array";

/**
 * Tree search with state
 * @param getChildren
 */
export const treeSearchStates = <R, S, O>(
  initialStates:S[], 
  getChildren: (last:S, level: number, states: S[]) => O[],
  getNextState: (node:O, state:S, level: number, states: S[]) => S,
  testFlow: (last:S, level: number, states: S[]) => R, 
) => {
  let level = 0;
  const states:S[] = [...initialStates];
  const nodes: O[][] = [];

  while(level >= 0) {
    if (!nodes[level]) {
      let last = getLast(states);
      const res = testFlow(last, level, states);
      if (res !== undefined) {
        // if valid flow
        return res;
      } else {
        // save children
        const children = getChildren(last, level, states);
        nodes[level] = [...children]; 
      }
    }
    if (!nodes[level].length) {
      // if no more child to test
      nodes.pop();
      states.pop();
      level--;
    } else {
      // consume child and test it
      const node = nodes[level].shift()!;
      const last = getLast(states);
      const nextState = getNextState(node, last, level, states);
      states.push(nextState);
      level++;
    }
  }
}

/**
 * Simple tree search
 * @param getChildren
 */
export const treeSearch = <R, T=number>(
  getChildren: (last: T, level: number, flow:T[]) => T[],
  testFlow: (last:T, level: number, states: T[]) => R
) => {
  return treeSearchStates<R, T, T>([], getChildren, (option) => option, testFlow);
}

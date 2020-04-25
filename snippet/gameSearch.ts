export const winningMove = <S, O>(initialState:S, getOptions: (state:S) => O[], getNextState: (state:S, option:O) => S) => {
  let level = 0;
  const states:S[] = [];
  const options: O[][] = [];
  states[0] = initialState;
  options[0] = getOptions(initialState);

  let currentOption = options[0][0];

  while(level >= 0) {
    if (!options[level].length) {
      if (level === 1) {
        return currentOption;
      } else {
        level -= 2;
      }
    } else {
      const state = states[level];
      const option = options[level].shift()!;
      const nextState = getNextState(state, option);
      const nextOptions = getOptions(nextState);
      if (level === 0) {
        currentOption = option;
      }
      level++;
      states[level] = nextState;
      options[level] = nextOptions;
    }
  }
}

export const winningMoves = <S, O>(initialState:S, getOptions: (state:S) => O[], getNextState: (state:S, option:O) => S) => {
  let level = 0;
  const states:S[] = [];
  const options: O[][] = [];
  states[0] = initialState;
  options[0] = getOptions(initialState);

  const winningOptions = [];
  let currentOption = null;

  while(level >= 0) {
    if (!options[level].length) {
      if (level === 1) {
        winningOptions.push(currentOption);
        level--;
      } else {
        level -= 2;
      }
    } else {
      const state = states[level];
      const option = options[level].shift()!;
      const nextState = getNextState(state, option);
      const nextOptions = getOptions(nextState);
      if (level === 0) {
        currentOption = option;
      }
      level++;
      states[level] = nextState;
      options[level] = nextOptions;
    }
  }
  return winningOptions;
}

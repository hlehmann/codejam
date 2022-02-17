import { range, removeArrayValue } from "../../snippet/array";
import { hashcodeRunner } from "../../snippet/hashcode";
import { logger } from "../../snippet/logger";
import { randomInt, randomQuadSelectOne } from "../../snippet/random";
import { getParsedLine, getSplittedLines } from "../../snippet/runner";

//https://codingcompetitions.withgoogle.com/hashcode/round/00000000008f5ca9/00000000008f6f33

interface State {
  score: number;
  clients: Client[];
  stats: any;
}

interface Client {
  index: number;
  exclusions: number[];
  coming: boolean;
  excluded: boolean;
  excludedBy: number[];
  coef: number;
}

interface Ingredient {
  likeBy: Client[];
  dislikedBy: Client[];
}

const load = (): State => {
  const C = getParsedLine();

  const initClients: Client[] = [];
  const initIngredientsMap: Map<string, Ingredient> = new Map();

  const getIngredient = (name: string) => {
    if (!initIngredientsMap.has(name)) {
      initIngredientsMap.set(name, {
        likeBy: [],
        dislikedBy: [],
      });
    }
    return initIngredientsMap.get(name)!;
  };

  for (const index of range(C)) {
    const [l, d] = getSplittedLines(2);
    l.shift();
    d.shift();
    const likes = l.map(getIngredient);
    const dislikes = d.map(getIngredient);
    const client: Client = {
      index,
      exclusions: [],
      excluded: false,
      excludedBy: [],
      coming: false,
      coef: 0,
    };
    likes.forEach((i) => {
      i.likeBy.push(client);
      i.dislikedBy.forEach((c) => {
        c.exclusions.push(client.index);
        client.exclusions.push(c.index);
      });
    });
    dislikes.forEach((i) => {
      i.dislikedBy.push(client);
      i.likeBy.forEach((c) => {
        c.exclusions.push(client.index);
        client.exclusions.push(c.index);
      });
    });
    initClients.push(client);
  }

  initClients.forEach((client) => (client.exclusions = [...new Set(client.exclusions)]));

  logger("Client", initClients.length);
  logger("Ingredients", initIngredientsMap.size);

  const state: State = { score: 0, clients: initClients, stats: {} };

  addTopClients(state);
  logger(1, state.score);
  return state;
};

const clone = (state: State): State => ({
  score: state.score,
  clients: state.clients.map((c) => ({
    index: c.index,
    exclusions: [...c.exclusions],
    coming: c.coming,
    excluded: c.excluded,
    excludedBy: [...c.excludedBy],
    coef: 0,
  })),
  stats: {},
});

const addClient = (client: Client, state: State) => {
  if (client.coming) return;
  client.coming = true;
  client.exclusions
    .map((i) => state.clients[i])
    .forEach((c) => {
      c.excludedBy.push(client.index);
      c.excluded = true;
    });
  state.score++;
};

const addTopClient = (state: State) => {
  const availableClients = state.clients.filter((c) => !c.excluded && !c.coming);
  if (!availableClients.length) return false;
  availableClients.forEach((client) => {
    // new exclusion
    client.coef = client.exclusions
      .map((i) => state.clients[i])
      .reduce((s, client) => (client.excluded ? s : s + 1), 0);
  });
  availableClients.sort((a, b) => a.coef - b.coef);
  const client = randomQuadSelectOne(availableClients);
  addClient(client, state);
  return true;
};

const addTopClients = (state: State) => {
  state.stats.availableClients = state.clients.filter((c) => !c.excluded && !c.coming).length;
  while (addTopClient(state));
};

const removeClient = (client: Client, state: State) => {
  if (!client.coming) return;
  client.coming = false;
  client.exclusions
    .map((i) => state.clients[i])
    .forEach((c) => {
      removeArrayValue(c.excludedBy, client.index);
      c.excluded = c.excludedBy.length !== 0;
    });
  state.score--;
};

const freeClient = (client: Client, state: State) => {
  client.excludedBy.map((i) => state.clients[i]).forEach((client) => removeClient(client, state));
};

const freeClients = (state: State) => {
  const excludedClients = state.clients.filter((c) => c.excluded);
  const size = randomInt(Math.min(10, excludedClients.length));
  excludedClients.forEach((client) => {
    client.coef = client.excludedBy.length;
  });
  excludedClients.sort((a, b) => a.coef - b.coef);
  const toFree = range(size).map(() => randomQuadSelectOne(excludedClients));
  toFree.forEach((client) => freeClient(client, state));
  state.stats.excludedClients = excludedClients.length;
  state.stats.toFree = toFree.length;
};

const freeClients2 = (state: State) => {
  const size = randomInt(20);
  range(size).forEach(() => {
    const excludedClients = state.clients.filter((c) => c.excluded);
    excludedClients.forEach((client) => {
      client.coef = client.excludedBy.length;
    });
    excludedClients.sort((a, b) => a.coef - b.coef);
    const client = randomQuadSelectOne(excludedClients);
    freeClient(client, state);
  });
};
const freeSwitchClient = (state: State) => {
  const excludedClients = state.clients.filter((c) => c.excluded);
  const toFree = excludedClients.filter((client) => client.excludedBy.length <= 2);
  toFree.forEach((client) => freeClient(client, state));
};

const removeSwitchClient = (state: State) => {
  const currentClients = state.clients.filter((c) => c.coming);
  const toRemove = currentClients.filter((client) =>
    client.exclusions.some((i) => state.clients[i].excludedBy.length <= 2)
  );
  toRemove.forEach((client) => removeClient(client, state));
};

const removeWorstClient = (state: State) => {
  const currentClients = state.clients.filter((c) => c.coming);
  const size = randomInt(Math.min(10, currentClients.length));
  currentClients.forEach((client) => {
    client.coef = client.exclusions.filter((i) => state.clients[i].excludedBy.length < size).length;
  });
  currentClients.sort((a, b) => b.coef - a.coef);
  const toRemove = range(size).map(() => randomQuadSelectOne(currentClients));
  toRemove.forEach((client) => removeClient(client, state));
};

const iterate = (state: State) => {
  freeClients(state);
  // freeClients2(state);
  // freeSwitchClient(state);
  removeWorstClient(state);
  // removeSwitchClient(state);
  addTopClients(state);
};

const print = (state: State) => {
  return "";
};

hashcodeRunner({
  // dataSet: { name: "a_an_example.in.txt" },
  // dataSet: { name: "b_basic.in.txt" },
  // dataSet: { name: "c_coarse.in.txt" },
  // dataSet: { name: "d_difficult.in.txt" },
  dataSet: { name: "e_elaborate.in.txt" },
  load,
  clone,
  iterate,
  print,
  __dirname,
});

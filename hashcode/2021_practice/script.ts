import { findIntersect, range } from "../../snippet/array";
import { randomInt } from "../../snippet/random";
import { getLines, getParsedSplitedLine } from "../../snippet/runner";
import { hashcodeRunner } from "../../snippet/hashcode";

type Delivery = { team: number; score: number; pizze: number[] };
type State = {
  T: number[];
  available: number[];
  availablePond: number[];
  score: number;
  deliveries: Delivery[];
  P: string[][];
  Pmax: number;
  Pcoef: number[];
  stats: any;
};

const load = (): State => {
  const [M, T2, T3, T4] = getParsedSplitedLine();
  const P = getLines(M).map((s) => s.split(" ").slice(1));
  const Pmax = P.map((l) => l.length).reduce((a, b) => Math.max(a, b));
  const Pcoef = P.map((l) => Math.ceil((l.length / Pmax) * 10));

  const state: State = {
    T: [0, 0, T2, T3, T4],
    available: range(M).sort((a, b) => P[b].length - P[a].length),
    availablePond: range(M)
      .map((p) => new Array(Pcoef[p]).fill(p))
      .flat(),
    score: 0,
    deliveries: [],
    P,
    Pmax,
    Pcoef,
    stats: {},
  };
  constructAll(state);

  return state;
};

const removePizza = (p: number, state: State) => {
  const jj = state.available.indexOf(p);
  state.available.splice(jj, 1);
  const jjj = state.availablePond.indexOf(p);
  state.availablePond.splice(jjj, state.Pcoef[p]);
};

const pickCoolPizze = (delivery: Delivery, state: State) => {
  // if(Math.random() >= 0.5) return;
  const ings: string[] = [];
  const pizze: number[] = [];
  let cpt = 0;
  let i = 0;

  while (cpt < delivery.team) {
    if (i === state.available.length) return;
    const p = state.available[i];
    if (!findIntersect(state.P[p], ings)) {
      removePizza(p, state);
      pizze.push(p);
      cpt++;
    } else {
      i++;
    }
  }

  return pizze;
};

const pickRandomPizze = (delivery: Delivery, state: State) => {
  const pizze: number[] = [];
  range(delivery.team).forEach(() => {
    const j = randomInt(state.availablePond.length);
    const p = state.availablePond[j];
    removePizza(p, state);
    pizze.push(p);
  });
  return pizze;
};

const construct = (state: State) => {
  // pick team
  const availableTeams = [];
  if (state.T[2] && state.available.length >= 2) availableTeams.push(...new Array(2).fill(2));
  if (state.T[3] && state.available.length >= 3) availableTeams.push(...new Array(3).fill(3));
  if (state.T[4] && state.available.length >= 4) availableTeams.push(...new Array(4).fill(4));
  if (!availableTeams.length) return false;
  const j = randomInt(availableTeams.length);
  const delivery: Delivery = { team: availableTeams[j], score: 0, pizze: [] };
  state.T[delivery.team]--;

  // pick pizze
  delivery.pizze = pickCoolPizze(delivery, state) || pickRandomPizze(delivery, state);

  // calculate score
  const ingrs = new Set();
  delivery.pizze.forEach((p) => state.P[p].forEach((ingr) => ingrs.add(ingr)));
  delivery.score = ingrs.size ** 2;
  state.score += delivery.score;

  // add delivery
  state.deliveries.push(delivery);
  return true;
};

const constructAll = (state: State) => {
  let ok = true;
  while (ok) {
    ok = construct(state);
  }
};

const destroy = (state: State) => {
  const j = randomInt(state.deliveries.length);
  const delivery = state.deliveries[j];

  state.T[delivery.team]++;
  delivery.pizze.forEach((p) => state.availablePond.push(...new Array(state.Pcoef[p]).fill(p)));
  delivery.pizze.forEach((p) => state.available.push(p));
  state.score -= delivery.score;
  state.deliveries.splice(j, 1);
};

const destroySome = (state: State) => {
  const j = Math.min(2, state.deliveries.length);
  range(j).forEach(() => destroy(state));
  state.available.sort((a, b) => state.P[b].length - state.P[a].length);
};

const clone = (state: State): State => ({
  T: state.T.slice(),
  available: state.available.slice(),
  availablePond: state.availablePond.slice(),
  score: state.score,
  deliveries: state.deliveries.slice(),
  P: state.P,
  Pmax: state.Pmax,
  Pcoef: state.Pcoef,
  stats: {},
});

const iterate = (state: State) => {
  destroySome(state);
  constructAll(state);
};

const print = (state: State) =>
  `${state.deliveries.length}\n${state.deliveries
    .map((delivery) => delivery.team + " " + delivery.pizze.join(" "))
    .join("\n")}`;

hashcodeRunner({
  // dataSet: {name: "a_example.in"},
  // dataSet: {name: "b_little_bit_of_everything.in"},
  dataSet: { name: "c_many_ingredients.in" },
  // dataSet: {name: "d_many_pizzas.in"},
  // dataSet: {name: "e_many_teams.in"},
  load,
  clone,
  iterate,
  print,
  __dirname,
});

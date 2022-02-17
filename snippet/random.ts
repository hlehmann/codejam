import { range } from "./array";

export const randomInt = (N: number) => {
  return Math.floor(Math.random() * N);
};

export const randomSquareInt = (N: number) => {
  return Math.floor(Math.random() ** 2 * N);
};

export const randomCubeInt = (N: number) => {
  return Math.floor(Math.random() ** 3 * N);
};

export const randomQuadInt = (N: number) => {
  return Math.floor(Math.random() ** 4 * N);
};

export const randomCubeSelect = <T>(items: T[]) => {
  if (items.length === 0) return [];
  return range(randomCubeInt(items.length) + 1).map(() => randomCubeSelectOne(items));
};

export const randomQuadSelect = <T>(items: T[]) => {
  if (items.length === 0) return [];
  return range(randomQuadInt(items.length) + 1).map(() => randomQuadSelectOne(items));
};

export const randomCubeSelectOne = <T>(items: T[]) => {
  return items[randomCubeInt(items.length)];
};

export const randomQuadSelectOne = <T>(items: T[]) => {
  return items[randomQuadInt(items.length)];
};

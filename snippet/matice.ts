import { getAllIntervals } from "./array";

export const getColumn = <T>(m:T[][], c:number) => {
  return m.map(row => row[c]);
}

export const getRow = <T>(m:T[][], r: number) => {
  return m[r];
}

export const subMatrice = <T>(m:T[][], r1: number, r2: number, c1: number, c2: number) => {
  return m.slice(r1, r2).map(row => row.slice(c1,c2));
}

export const getAllSubBoxes = (r1:number,r2:number,c1:number,c2:number) => {
  const rIntervals = getAllIntervals(r1,r2);
  const cIntervals = getAllIntervals(c1,c2);
  return rIntervals.flatMap(([r1, r2]) => cIntervals.map(([c1,c2]) => [r1, r2, c1, c2]))
}
// https://en.wikipedia.org/wiki/Nim
// https://en.wikipedia.org/wiki/Sprague%E2%80%93Grundy_theorem

export const nimSum = (a:number, b:number) => a ^ b;

export const getArrayMEX = (arr: number[]) => {
  let i = 0;
  while(arr.includes(i)) {
    i++;
  }
  return i;
}
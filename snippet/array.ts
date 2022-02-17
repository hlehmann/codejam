export const cloneArray3 = <T>(arr: T[][][]) => {
  return cloneArray(arr.map(cloneArray2));
};

export const cloneArray2 = <T>(arr: T[][]) => {
  return cloneArray(arr.map(cloneArray));
};

export const cloneArray = <T>(arr: T[]) => {
  return [...arr];
};

export const range = (n: number) => {
  return Array.from(new Array(n).keys());
};

export const first = <T>(arr: T[]) => arr[0];
export const last = <T>(arr: T[]) => arr[arr.length - 1];

export const findOne = <T>(arr: T[], test: (item: T) => boolean) => {
  return arr.find(test);
};

export const findOneAsync = async <T>(arr: T[], test: (item: T) => Promise<boolean>) => {
  for (const item of arr) {
    const res = await test(item);
    if (res) return item;
  }
};

export const getLast = <T>(arr: T[]) => {
  return arr[arr.length - 1];
};

export const removeArrayValue = <T>(arr: T[], v: T) => {
  const index = arr.indexOf(v);
  if (index != -1) {
    arr.splice(index, 1);
  }
};

export const addArrayValue = <T>(arr: T[], v: T) => {
  const index = arr.indexOf(v);
  if (index === -1) {
    arr.push(v);
  }
};

export const checkDistinctInt = (arr: number[]) => {
  const index = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (index[v]) return 1;
    index[v] = true;
  }
  return 0;
};

export const excludeArray = <T>(arr: T[], items: T[]) => {
  return arr.filter((item) => items.indexOf(item) === -1);
};

export const getAllIntervals = (x1: number, x2: number) => {
  const intervals: [number, number][] = [];
  for (let l = 1; l < x2 - x1; l++) {
    for (let x = x1; x < x2 - l; x++) {
      intervals.push([x, x + l]);
    }
  }
  return intervals;
};

export const getAllPermutations = <D>(source: D[], size = source.length): D[][] => {
  if (size === 1) {
    return source.map((value) => [value]);
  }
  if (size === 0) {
    return [];
  }
  return source.flatMap((value, index) => {
    const next = [...source];
    next.splice(index, 1);
    return getAllPermutations(next, size - 1).map((perm) => [value, ...perm]);
  });
};

export const getAllSets = <D>(source: D[], size: number): D[][] => {
  if (size === 1) {
    return source.map((value) => [value]);
  }
  if (size === 0) {
    return [];
  }
  return source.flatMap((value, index) => {
    const next = [...source];
    next.splice(0, index + 1);
    return getAllSets(next, size - 1).map((perm) => [value, ...perm]);
  });
};

export const groupValues = <D>(arr: D[]) => {
  const groups = new Map<D, number[]>();

  arr.forEach((value, index) => {
    let indexes = groups.get(value);
    if (!indexes) {
      indexes = [];
      groups.set(value, indexes);
    }
    indexes.push(index);
  });

  return [...groups.entries()];
};

export const findIndexes = <D>(arr: D[], value: D) => {
  const indexes: number[] = [];

  arr.forEach((v, index) => {
    if (v === value) {
      indexes.push(index);
    }
  });

  return indexes;
};

export const findIntersect = <D>(arr1: D[], arr2: D[]) => {
  for (let i = 0; i < arr1.length; i++) {
    const value = arr1[i];
    const j = arr2.indexOf(value);
    if (j !== -1) {
      return [value, i, j] as [D, number, number];
    }
  }
};

export const findMinIndex = <D>(arr: D[]) => {
  let minIndex = 0;
  let minValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }
  return minIndex;
};

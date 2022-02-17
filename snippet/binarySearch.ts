/* Find extrem number get true
 *
 * test(a) = true
 * test(b) = false
 * a < b or a > b
 */

export const binarySearchBigInt = (a: bigint, b: bigint, test: (current: bigint) => boolean) => {
  while (b - a > 1) {
    const current = (a + b) / 2n;
    const result = test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
};

export const binarySearchFloat = (a: number, b: number, test: (current: number) => boolean, precision = 1) => {
  while (Math.abs(b - a) > precision) {
    const current = (a + b) / 2;
    const result = test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
};

export const binarySearchFloatAsync = async (
  a: number,
  b: number,
  test: (current: number) => Promise<boolean>,
  precision = 1
) => {
  while (Math.abs(b - a) > precision) {
    const current = (a + b) / 2;
    const result = await test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
};

export const binarySearchInt = (
  a: number,
  b: number,
  test: (current: number) => boolean | Promise<boolean>,
  precision = 1
) => {
  while (Math.abs(b - a) > precision) {
    const current = Math.floor((a + b) / 2);
    const result = test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
};

export const binarySearchIntAsync = async (
  a: number,
  b: number,
  test: (current: number) => boolean | Promise<boolean>,
  precision = 1
) => {
  while (Math.abs(b - a) > precision) {
    const current = Math.floor((a + b) / 2);
    const result = await test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
};

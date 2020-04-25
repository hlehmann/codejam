/* Find extrem number get true
 * 
 * test(a) = true
 * test(b) = false
 * a < b or a > b
 */

export const binarySearchFloat = async (
  a: number, 
  b : number,
  test:(current:number) => boolean,
  precision = 1
) => {
  while(Math.abs(b - a) > precision) {
    const current = (a + b) / 2;
    const result = test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
}

export const binarySearchFloatAsync = async (
  a: number, 
  b : number,
  test:(current:number) => Promise<boolean>,
  precision = 1
) => {
  while(Math.abs(b - a) > precision) {
    const current = (a + b) / 2;
    const result = await test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
}

export const binarySearchInt = async (
  a: number, 
  b : number,
  test:(current:number) => boolean | Promise<boolean>,
  precision = 1
) => {
  while(Math.abs(b - a) > precision) {
    const current = Math.floor((a + b) / 2);
    const result = await test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
}

export const binarySearchIntAsync = async (
  a: number, 
  b : number,
  test:(current:number) => boolean | Promise<boolean>,
  precision = 1
) => {
  while(Math.abs(b - a) > precision) {
    const current = Math.floor((a + b) / 2);
    const result = await test(current);
    if (result) {
      a = current;
    } else {
      b = current;
    }
  }
  return a;
}

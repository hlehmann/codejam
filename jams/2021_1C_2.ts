import { range } from "../snippet/array";
import { logger } from "../snippet/logger";
import { loadStdin, loadSample, runner, getLine } from "../snippet/runner";

// https://codingcompetitions.withgoogle.com/codejam/round/00000000004362d7/00000000007c0f01

process.env.NODE_ENV === "production"
  ? loadStdin()
  : loadSample(`5
2020
2021
68000
101
646448547641684864`);

interface Combinaison {
  size: number;
  numbersBeforeJump: number;
  numbersAfterJump: number;
}

const test = () => {
  const Y = getLine();

  const L = Y.length;
  const YY = BigInt(Y);
  logger(L);

  const getCombinaisons = (L: number) => {
    const combinaisons: Combinaison[] = [];
    for (let size = 1; size <= L / 2; size++) {
      for (let numbersBeforeJump = 1; numbersBeforeJump <= L / size; numbersBeforeJump++) {
        const numbersAfterJump = (L - numbersBeforeJump * size) / (size + 1);
        if (Number.isInteger(numbersAfterJump)) {
          if (size === 1 && numbersBeforeJump > 9) continue;
          combinaisons.push({ size, numbersBeforeJump, numbersAfterJump });
        }
      }
    }

    return combinaisons;
  };

  const getCombinaisonFirstNumber = (combinaison: Combinaison, from: bigint) => {
    const { size, numbersBeforeJump, numbersAfterJump } = combinaison;
    const totalNumbers = numbersBeforeJump + numbersAfterJump;

    if (numbersAfterJump) {
      const first = 10 ** size - numbersBeforeJump;
      const n = BigInt(
        range(totalNumbers)
          .map((i) => first + i)
          .join("")
      );
      if (BigInt(n) > from) return n;
    } else {
      let first = Number(from / 10n ** BigInt(size * (numbersBeforeJump - 1)));
      if (first < 10 ** (size - 1)) first = 10 ** (size - 1);
      if (first > 10 ** size - numbersBeforeJump) return;
      // ckeck next if equal
      let n = BigInt(
        range(totalNumbers)
          .map((i) => first + i)
          .join("")
      );
      if (BigInt(n) > from) return n;
      first++;
      if (first > 10 ** size - numbersBeforeJump) return;
      n = BigInt(
        range(totalNumbers)
          .map((i) => first + i)
          .join("")
      );
      return n;
    }
  };

  const getFirstNumber = (L: number, YY: bigint): bigint => {
    const combinaisons = getCombinaisons(L);

    let min: bigint | null = null;
    for (const combinaison of combinaisons) {
      const firstNumber = getCombinaisonFirstNumber(combinaison, YY);
      logger(`${combinaison.size}-${combinaison.numbersBeforeJump}-${combinaison.numbersAfterJump}-${firstNumber}`);
      if (firstNumber && (!min || firstNumber < min)) {
        min = firstNumber;
      }
    }
    if (!min) return getFirstNumber(L + 1, YY);
    logger(min.toString());
    return min;
  };

  return getFirstNumber(L, YY).toString();
};

runner(test);

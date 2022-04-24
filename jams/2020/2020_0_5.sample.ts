import { logger } from "../../snippet/logger";

export const get202005Sample = () => {
  let tests = 0;
  const input = [];
  for (let N = 2; N <= 5; N++) {
    for (let K = N; K <= N * N; K++) {
      input.push(N + " " + K);
      tests++;
    }
  }

  input.push("10 23");
  input.push("20 47");
  input.push("30 99");
  input.push("50 284");
  tests += 4;

  input.unshift(tests);
  logger("--- sample ---");
  logger(input.join("\n"));
  logger("--- end sample ---");

  return input.join("\n");
};

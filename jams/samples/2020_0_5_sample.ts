import { logger } from "../../snippet/logger";

export const get202005Sample = () => {
  let tests = 0
  let input = []
  for(let N=2; N <= 5;N++) {
    for (let K = N ; K <= N*N; K++) {
      tests++;
      input.push(N+" "+K);
    }
  }
  input.unshift(tests);
  logger("--- sample ---");
  logger(input.join("\n"));
  logger("--- end sample ---");
  return input.join("\n")
}

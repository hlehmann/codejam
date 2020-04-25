import { runner, loadSample, getLine, loadStdin } from "../snippet/runner"

//https://codingcompetitions.withgoogle.com/codejam/round/000000000019fd27/0000000000209a9f

process.env.NODE_ENV === "production" 
  ? loadStdin()
  : loadSample(`4
0000
101
111000
1`)

const test = () => {
  const arr = Array.from(getLine());
  let depth = 0;
  let res = "";

  arr.forEach(s => {
    const i = parseInt(s);
    if (i > depth) {
      res += "(".repeat(i - depth)+i;
      depth = i;
    } else if (i < depth) {
      res += ")".repeat(depth - i)+i;
      depth = i;
    } else {
      res+=i;
    }
  })
  res += ")".repeat(depth)

  return res;
}

runner(test);
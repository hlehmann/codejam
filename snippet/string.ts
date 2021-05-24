export const splitStr = (s:string) => s.split(" ")

export const parseSplitStr = (s:string) => s.split(" ").map((s) => parseFloat(s))

export const parseStr = (s:string) => parseFloat(s)

export const formatFloat = (n: number, p:number) => {
  return n.toFixed(p);
}
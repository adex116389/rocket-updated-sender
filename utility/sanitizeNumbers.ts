export const sanitizeNumbers = (numbers: string[]) => {
  const nums = numbers
    .toString()
    .replace("\r\n", "\n")
    .replace("\r", "\n")
    .split("\n");

  const n = nums
    .toString()
    .split(`,`)
    .map((number: string) => number.replace(/\s/g, "").replace("+", ""));

  return n;
};
export const sanitizeNumber = (number: string) => {
  return number.replace(/\s/g, "").replace("+", "").replace(/\s/g, "").trim();
};

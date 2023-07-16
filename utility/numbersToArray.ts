export const numbersToArray = (numbers: string) => {
  // Split by any type of line break or comma
  const nums = numbers.split(/[\r\n,]+/);
  return nums;
};


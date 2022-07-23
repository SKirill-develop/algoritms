export const getFibonacciNumbers = (num: number): number[] => {
  let res: number[] = [];

  const findFibonacciNumbers = (
    num: number,
    memo: Record<number, number> = {}
  ): number => {
    if (num in memo) {
      return memo[num];
    }
    if (num === 0) {
      res[num] = 1;
      return 0;
    }
    if (num === 1) {
      res[num] = 1;
      return 1;
    }
    memo[num] =
      findFibonacciNumbers(num - 1, memo) + findFibonacciNumbers(num - 2, memo);
    res[num - 1] = memo[num];
    return memo[num];
  };

  findFibonacciNumbers(num + 1);
  return res;
};

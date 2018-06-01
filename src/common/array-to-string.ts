export function arrayToString(values: IterableIterator<string> | ReadonlyArray<string>) {
  let result: string = '';
  for (const value of values) {
    if (result.length) {
      result += ', ';
    }
    result += value;
  }
  return result;
}

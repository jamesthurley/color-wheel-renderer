// Adapted from https://github.com/jasmine/jasmine/blob/master/src/core/matchers/toBeCloseTo.js
export function isCloseTo(actual: number, expected: number, precision: number = 4): boolean {
  if (precision !== 0) {
    precision = precision || 4;
  }

  if (expected === null || actual === null) {
    throw new Error(`Cannot use isCloseTo with null. Arguments evaluated to: actual=${actual}, expected=${expected}`);
  }

  const pow = Math.pow(10, precision + 1);
  const delta = Math.abs(expected - actual);
  const maxDelta = Math.pow(10, -precision) / 2;

  return Math.round(delta * pow) / pow <= maxDelta;
}

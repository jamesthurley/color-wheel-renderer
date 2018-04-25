
  export function ensureRange(input: number, min: number, max: number): number {
    if (input < min) {
      return min;
    }

    if (input > max) {
      return max;
    }

    return input;
  }

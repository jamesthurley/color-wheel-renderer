export enum BucketDirection {
  down,
  up,
}

export function bucket(value: number, maximum: number, buckets: number, direction: BucketDirection) {
  switch (direction) {
    case BucketDirection.up:
      return bucketUp(value, maximum, buckets);

    default:
      return bucketDown(value, maximum, buckets);
  }
}

export function bucketDown(value: number, maximum: number, buckets: number): number {
  if (buckets < 1) {
    return value;
  }

  const factor = maximum / buckets;
  return Math.floor(value / factor) * factor;
}

export function bucketUp(value: number, maximum: number, buckets: number): number {
  return maximum - bucketDown(maximum - value, maximum, buckets);
}

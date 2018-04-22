export function bucket(v: number, maximum: number, buckets: number): number {
  if (buckets < 1) {
    return v;
  }

  const bucketSize = maximum / buckets;
  let currentBucketMin = 0;
  let currentBucketMax = bucketSize;
  for (let bucketIndex = 0; bucketIndex < buckets; ++bucketIndex) {

    if (v >= currentBucketMin && v < currentBucketMax) {
      return currentBucketMin;
    }

    currentBucketMin = currentBucketMax;
    currentBucketMax += bucketSize;
  }

  return maximum;
}

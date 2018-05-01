import test from 'ava';
import { bucketUp, bucketDown } from './bucket';
import { isCloseTo } from '../common/is-close-to';

test('when bucketing up, it should return expected values', t => {
  t.true(isCloseTo(bucketUp(0.45, 1, 10), 0.5));
  t.true(isCloseTo(bucketUp(0.5, 1, 10), 0.5));
  t.true(isCloseTo(bucketUp(0.55, 1, 10), 0.6));
  t.true(isCloseTo(bucketUp(0.59, 1, 10), 0.6));
  t.true(isCloseTo(bucketUp(0.61, 1, 10), 0.7));

  t.true(isCloseTo(bucketUp(187, 360, 36), 190));
});

test('when bucketing down, it should return expected values', t => {
  t.true(isCloseTo(bucketDown(0.45, 1, 10), 0.4));
  t.true(isCloseTo(bucketDown(0.5, 1, 10), 0.5));
  t.true(isCloseTo(bucketDown(0.55, 1, 10), 0.5));
  t.true(isCloseTo(bucketDown(0.59, 1, 10), 0.5));
  t.true(isCloseTo(bucketDown(0.61, 1, 10), 0.6));

  t.true(isCloseTo(bucketDown(187, 360, 36), 180));
});

import test from 'ava';
import { arrayToString } from './array-to-string';

test('it should concatenate array into readable string', t => {
  t.is('one, two, three', arrayToString(['one', 'two', 'three']));
  t.is('one', arrayToString(['one']));
});

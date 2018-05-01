import test from 'ava';
import { isCloseTo } from './is-close-to';

test('it should return true when values are within precision', t => {
  t.true(isCloseTo(1.80000001, 1.8, 3));
  t.false(isCloseTo(1.89, 1.8, 3));
});

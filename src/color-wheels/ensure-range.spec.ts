import test from 'ava';
import { ensureRange } from './ensure-range';

test('it should return values within range', t => {
  t.is(5, ensureRange(5.1, 3, 5));
  t.is(5, ensureRange(5, 3, 5));
  t.is(4.1, ensureRange(4.1, 3, 5));
  t.is(3, ensureRange(3, 3, 5));
  t.is(3, ensureRange(2.1, 3, 5));
});

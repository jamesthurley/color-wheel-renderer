import test from 'ava';
import { isNumericString } from './is-numeric-string';

test('it return true for strings representing numbers', t => {
  t.true(isNumericString('1.243'));
  t.true(isNumericString('1243'));
  t.false(isNumericString('1243e'));
  t.false(isNumericString('mp4'));
  t.false(isNumericString(''));
});

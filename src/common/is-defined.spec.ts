import test from 'ava';
import { isDefined } from './is-defined';

test('it should return true for defined values', t => {
  t.true(isDefined(''));
  t.true(isDefined('hello'));
  t.true(isDefined(0));
  t.true(isDefined(1));
  t.true(isDefined([]));
  t.true(isDefined([1]));
  t.true(isDefined(null));
  t.false(isDefined(undefined));
});

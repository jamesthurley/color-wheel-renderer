import test from 'ava';
import { toNumber } from './to-number';
import { DisplayableError } from './displayable-error';

test('it should return default value if undefined', t => {
  t.is(0, toNumber(undefined, 'blah'));
  t.is(55, toNumber(undefined, 'blah', 55));
});

test('it should throw if not a number', t => {
  const error = t.throws(() => toNumber('hello', 'blah', 55), DisplayableError);

  const message = error.message as string;
  t.true(message.indexOf('blah') !== -1);
});

test('it should return number if numeric string', t => {
  t.is(123, toNumber('123', 'blah'));
  t.is(200, toNumber('200', 'blah', 55));
});

import test from 'ava';
import { padStart } from './pad-start';

test('it pad the start of strings', t => {
  t.is('0001', padStart('1', 4));
  t.is('xxx1', padStart('1', 4, 'x'));
  t.is('12345', padStart('12345', 4, 'x'));
  t.is('xxxhello', padStart('hello', 8, 'x'));
});

test('it pad the start of numbers', t => {
  t.is('0001', padStart(1, 4));
  t.is('xxx1', padStart(1, 4, 'x'));
  t.is('12345', padStart(12345, 4, 'x'));
  t.is('001.23', padStart(1.23, 6));
});

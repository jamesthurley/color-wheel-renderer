import test from 'ava';
import { getAngleDegrees } from './get-angle-degrees';

test('it should return angle in degrees from vertical', t => {
  t.is(0, getAngleDegrees(0, 0, 0, -100));
  t.is(0, getAngleDegrees(10, 10, 10, -100));
  t.is(90, getAngleDegrees(10, 10, 100, 10));
  t.is(180, getAngleDegrees(10, 10, 10, 50));
  t.is(270, getAngleDegrees(10, 10, -20, 10));

  t.is(45, getAngleDegrees(0, 0, 1, -1));
  t.is(135, getAngleDegrees(0, 0, 1, 1));
  t.is(225, getAngleDegrees(0, 0, -1, 1));
  t.is(315, getAngleDegrees(0, 0, -1, -1));
});

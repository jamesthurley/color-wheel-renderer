import test from 'ava';
import { Rectangle } from './rectangle';
import { Border } from './border';

test('it should convert a border to a rectangle', t => {
  t.deepEqual(new Rectangle(0, 0, 2, 2), new Border(0, 0, 1, 1).toRectangle());
  t.deepEqual(new Rectangle(10, 20, 100, 50), new Border(10, 20, 109, 69).toRectangle());
});

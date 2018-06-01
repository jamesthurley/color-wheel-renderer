import test from 'ava';
import { getNumericEnumKeys, getStringEnumKeys } from './get-enum-keys';

enum TestNumericEnum {
  One,
  Two,
  Three,
}

enum TestStringEnum {
  One = 'one',
  Two = 'two',
  Three = 'three',
}

test('it should return keys in numeric enum', t => {
  t.deepEqual(['One', 'Two', 'Three'], getNumericEnumKeys(TestNumericEnum));
});

test('it should return keys in string enum', t => {
  t.deepEqual(['one', 'two', 'three'], getStringEnumKeys(TestStringEnum));
});

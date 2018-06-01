import test from 'ava';
import { isValidNumericEnumKey, isValidStringEnumKey } from './is-valid-enum-key';

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

test('it should test validity in numeric enum', t => {
  t.true(isValidNumericEnumKey(TestNumericEnum, 'One'));
  t.true(isValidNumericEnumKey(TestNumericEnum, 'Two'));
  t.true(isValidNumericEnumKey(TestNumericEnum, 'Three'));
  t.false(isValidNumericEnumKey(TestNumericEnum, 'Four'));
  t.false(isValidNumericEnumKey(TestNumericEnum, 'one'));
  t.false(isValidNumericEnumKey(TestNumericEnum, '1'));
});

test('it should test validity in string enum', t => {
  t.true(isValidStringEnumKey(TestStringEnum, 'one'));
  t.true(isValidStringEnumKey(TestStringEnum, 'two'));
  t.true(isValidStringEnumKey(TestStringEnum, 'three'));
  t.false(isValidStringEnumKey(TestStringEnum, 'four'));
  t.false(isValidStringEnumKey(TestStringEnum, 'One'));
  t.false(isValidStringEnumKey(TestStringEnum, '1'));
});

import { isNumericString } from './is-numeric-string';

export function isValidNumericEnumKey(enumType: any, value: string) {
  return value in enumType && !isNumericString(value);
}

export function isValidStringEnumKey(enumType: any, value: string) {
  return (Object as any).values(enumType).includes(value);
}

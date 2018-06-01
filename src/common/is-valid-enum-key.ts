import { isNumeric } from './is-numeric';

export function isValidNumericEnumKey(enumType: any, value: string) {
  return value in enumType && !isNumeric(value);
}

export function isValidStringEnumKey(enumType: any, value: string) {
  return (Object as any).values(enumType).includes(value);
}

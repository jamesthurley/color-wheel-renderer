import { isValidNumericEnumKey } from './is-valid-enum-key';

export function getNumericEnumKeys(enumType: any): string[] {
  return Object.keys(enumType).filter(v => isValidNumericEnumKey(enumType, v));
}

export function getStringEnumKeys(enumType: any): string[] {
  return (Object as any).values(enumType);
}

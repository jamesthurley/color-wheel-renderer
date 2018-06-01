import { isDefined } from './is-defined';

export function isNumericString(value: string): boolean {
  return isDefined(value) && value.length > 0 && !isNaN(+value);
}

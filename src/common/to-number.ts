import { DisplayableError } from './displayable-error';
import { isUndefined } from 'util';

export function toNumber(value: string | undefined, name: string, defaultValue: number = 0): number {

  if (isUndefined(value)) {
    return defaultValue;
  }

  const result = +value;
  if (isNaN(result)) {
    throw new DisplayableError(`Value ${name} should be a number (${value}).`);
  }

  return result;
}

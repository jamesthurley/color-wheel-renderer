import { isUndefined } from 'util';

export function isDefined(input: any) {
  return !isUndefined(input);
}

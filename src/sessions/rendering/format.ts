import { isValidStringEnumKey } from '../../common/is-valid-enum-key';
import { getStringEnumKeys } from '../../common/get-enum-keys';

export enum Format {
  all = 'all',
  gif = 'gif',
  mp4 = 'mp4',
}

export function isValidFormat(value: string) {
  return isValidStringEnumKey(Format, value);
}

export function formats(): string[] {
  return getStringEnumKeys(Format);
}

import { isValidStringEnumKey } from '../../common/is-valid-enum-key';
import { getStringEnumKeys } from '../../common/get-enum-keys';

export enum GifQuantizer {
  dekker = 'dekker',
  sorokin = 'sorokin',
  wu = 'wu',
}

export function isValidGifQuantizer(value: string) {
  return isValidStringEnumKey(GifQuantizer, value);
}

export function gifQuantizers(): string[] {
  return getStringEnumKeys(GifQuantizer);
}

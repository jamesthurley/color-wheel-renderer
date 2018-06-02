import { isValidStringEnumKey } from '../../common/is-valid-enum-key';
import { getStringEnumKeys } from '../../common/get-enum-keys';

export enum ColorWheelType {
  hslFixedSaturation = 'hsl-fixed-saturation',
  hslFixedLightness = 'hsl-fixed-lightness',
  hsvFixedSaturation = 'hsv-fixed-saturation',
  hsvFixedValue = 'hsv-fixed-value',
}

export function isValidColorWheelType(value: string) {
  return isValidStringEnumKey(ColorWheelType, value);
}

export function colorWheelTypes(): string[] {
  return getStringEnumKeys(ColorWheelType);
}

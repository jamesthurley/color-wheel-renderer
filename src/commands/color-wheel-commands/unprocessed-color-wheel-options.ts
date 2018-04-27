export interface IUnprocessedColorWheelOptions {
  type: ColorWheelType | undefined;

  output: string | undefined;
  verbose: boolean;
  diameter: string;
  margin: string;
  expand: boolean;
  reverseRadialColors: boolean;

  hueBuckets: string;
  saturationBuckets: string;
  lightnessBuckets: string;
  valueBuckets: string;

  saturation: string[];
  lightness: string[];
  value: string[];
}

export enum ColorWheelType {
  HslFixedSaturation = 'HslFixedSaturation',
  HslFixedLightness = 'HslFixedLightness',
  HsvFixedSaturation = 'HsvFixedSaturation',
  HsvFixedValue = 'HsvFixedValue',
}

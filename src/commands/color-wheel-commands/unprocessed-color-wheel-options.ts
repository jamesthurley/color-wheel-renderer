export interface IUnprocessedColorWheelOptions {
  type: ColorWheelType | undefined;

  output: string | undefined;
  verbose: boolean;
  diameter: string;
  margin: string;
  expand: boolean;
  reverseRadialColors: boolean;

  angularBuckets: string;
  radialBuckets: string;
  fixed: string[];
}

export enum ColorWheelType {
  HslFixedSaturation = 'HslFixedSaturation',
  HslFixedLightness = 'HslFixedLightness',
  HsvFixedSaturation = 'HsvFixedSaturation',
  HsvFixedValue = 'HsvFixedValue',
}

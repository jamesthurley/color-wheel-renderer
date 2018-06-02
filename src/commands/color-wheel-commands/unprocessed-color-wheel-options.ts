import { ColorWheelType } from './color-wheel-type';

export interface IUnprocessedColorWheelOptions {
  type: ColorWheelType | undefined;

  output: string | undefined;
  verbose: boolean;
  diameter: string;
  margin: string;
  expand: boolean;
  reverseRadialColors: boolean;
  reverseRadialBucketing: boolean;

  angularBuckets: string;
  radialBuckets: string;
  fixed: string[];
}

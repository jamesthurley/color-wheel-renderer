export interface IUnprocessedColorWheelOptions {
  type: string;

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

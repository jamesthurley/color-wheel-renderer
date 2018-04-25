import { Pixel } from '../../common/pixel';
import { BucketDirection } from '../bucket';

export interface IColorModelPixelRenderer {

  readonly isAngleInverted: boolean;
  readonly isVaryingDimensionInverted: boolean;

  readonly angleBucketDirection: BucketDirection;
  readonly varyingDimensionBucketDirection: BucketDirection;

  render(angleDegrees: number, varyingDimensionValue: number): Pixel;
}

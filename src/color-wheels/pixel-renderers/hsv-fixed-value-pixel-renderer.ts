import { HsvPixelRendererBase } from './hsv-pixel-renderer-base';
import { IColorModelPixelRenderer } from './color-model-pixel-renderer';
import { Pixel } from '../../common/pixel';
import { BucketDirection } from '../bucket';

export class HsvFixedValuePixelRenderer extends HsvPixelRendererBase implements IColorModelPixelRenderer {
  constructor(
    private readonly value: number,
    public readonly isAngleInverted: boolean,
    public readonly isVaryingDimensionInverted: boolean,
    public readonly angleBucketDirection: BucketDirection,
    public readonly varyingDimensionBucketDirection: BucketDirection) {
    super();
  }

  public render(angleDegrees: number, varyingDimensionValue: number): Pixel {
    return this.renderInner(angleDegrees, varyingDimensionValue, this.value);
  }
}

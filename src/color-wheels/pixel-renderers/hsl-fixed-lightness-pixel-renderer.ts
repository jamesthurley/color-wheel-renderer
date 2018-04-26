import { HslPixelRendererBase } from './hsl-pixel-renderer-base';
import { IColorModelPixelRenderer } from './color-model-pixel-renderer';
import { Pixel } from '../../common/pixel';
import { BucketDirection } from '../bucket';

export class HslFixedLightnessPixelRenderer extends HslPixelRendererBase implements IColorModelPixelRenderer {
  constructor(
    private readonly lightness: number,
    public readonly isAngleInverted: boolean,
    public readonly isVaryingDimensionInverted: boolean,
    public readonly angleBucketDirection: BucketDirection,
    public readonly varyingDimensionBucketDirection: BucketDirection) {
    super();
  }

  public render(angleDegrees: number, varyingDimensionValue: number): Pixel {
    return this.renderInner(angleDegrees, varyingDimensionValue, this.lightness);
  }
}

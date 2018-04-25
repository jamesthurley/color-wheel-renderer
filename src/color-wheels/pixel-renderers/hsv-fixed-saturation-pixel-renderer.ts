import { HsvPixelRendererBase } from './hsv-pixel-renderer-base';
import { IColorModelPixelRenderer } from './color-model-pixel-renderer';
import { Pixel } from '../../common/pixel';
import { ensureRange } from '../ensure-range';
import { BucketDirection } from '../bucket';

export class HsvFixedSaturationPixelRenderer extends HsvPixelRendererBase implements IColorModelPixelRenderer {
  constructor(
    private readonly saturation: number,
    public readonly isAngleInverted: boolean,
    public readonly isVaryingDimensionInverted: boolean,
    public readonly angleBucketDirection: BucketDirection,
    public readonly varyingDimensionBucketDirection: BucketDirection) {

    super();
    this.saturation = ensureRange(saturation, 0, 1);
  }

  public render(angleDegrees: number, varyingDimensionValue: number): Pixel {
    return this.renderInner(angleDegrees, this.saturation, varyingDimensionValue);
  }
}

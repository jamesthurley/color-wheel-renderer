import { ICommand } from '../command';
import { HsvFixedValuePixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-value-pixel-renderer';
import { HsvFixedSaturationPixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-saturation-pixel-renderer';
import { ColorWheelDefinition } from '../../color-wheels/color-wheel-definition';
import { ColorWheelSetRenderer } from '../../color-wheels/color-wheel-set-renderer';
import { BucketDirection } from '../../color-wheels/bucket';
import { HslFixedSaturationPixelRenderer } from '../../color-wheels/pixel-renderers/hsl-fixed-saturation-pixel-renderer';
import { HslFixedLightnessPixelRenderer } from '../../color-wheels/pixel-renderers/hsl-fixed-lightness-pixel-renderer';
import { ColorWheelOptions } from './color-wheel-options';
import { ColorWheelType } from './unprocessed-color-wheel-options';
import { DisplayableError } from '../../common/displayable-error';

export class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly options: ColorWheelOptions,
    public readonly colorWheelSetRenderer: ColorWheelSetRenderer) {
  }

  public execute(): Promise<void> {
    let colorWheelDefinitions: ColorWheelDefinition[] = [];

    const size = this.options.diameter + this.options.margin * 2;

    if (this.options.expand) {
      colorWheelDefinitions = [
        new ColorWheelDefinition(
          size,
          this.options.margin,
          this.options.angularBuckets,
          this.options.radialBuckets,
          this.options.fixed.map(
            v => this.createPixelRenderer(
              this.options.type, v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up))),
      ];
    }
    else {
      colorWheelDefinitions =
        this.options.fixed.map(v => new ColorWheelDefinition(
          size,
          this.options.margin,
          this.options.angularBuckets,
          this.options.radialBuckets,
          [
            this.createPixelRenderer(
              this.options.type, v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up),
          ]));
    }

    const image = this.colorWheelSetRenderer.render(colorWheelDefinitions, 0);
    image.write(this.options.outputFile);
    return Promise.resolve();
  }

  private createPixelRenderer(
    type: ColorWheelType,
    fixed: number,
    isAngleInverted: boolean,
    isVaryingDimensionInverted: boolean,
    angleBucketDirection: BucketDirection,
    varyingDimensionBucketDirection: BucketDirection) {

    switch (this.options.type) {
      case ColorWheelType.HslFixedSaturation:
        return new HslFixedSaturationPixelRenderer(
         fixed, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up);

      case ColorWheelType.HslFixedLightness:
        return new HslFixedLightnessPixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up);

      case ColorWheelType.HsvFixedSaturation:
        return new HsvFixedSaturationPixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up);

      case ColorWheelType.HsvFixedValue:
        return new HsvFixedValuePixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up);

      default:
        throw new DisplayableError('Unexpected color wheel type: ' + type);
    }
  }
}

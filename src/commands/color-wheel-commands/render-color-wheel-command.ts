import { ICommand } from '../command';
import { HsvFixedValuePixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-value-pixel-renderer';
import { HsvFixedSaturationPixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-saturation-pixel-renderer';
import { ColorWheelDefinition } from '../../color-wheels/color-wheel-definition';
import { ColorWheelSetRenderer } from '../../color-wheels/color-wheel-set-renderer';
import { BucketDirection } from '../../color-wheels/bucket';
import { HslFixedSaturationPixelRenderer } from '../../color-wheels/pixel-renderers/hsl-fixed-saturation-pixel-renderer';
import { HslFixedLightnessPixelRenderer } from '../../color-wheels/pixel-renderers/hsl-fixed-lightness-pixel-renderer';
import { ColorWheelOptions } from './color-wheel-options';
import { ColorWheelType } from './color-wheel-type';
import { DisplayableError } from '../../common/displayable-error';
import { IColorWheelConsumer } from '../../color-wheels/color-wheel-consumers/color-wheel-consumer';

export class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly options: ColorWheelOptions,
    public readonly colorWheelSetRenderer: ColorWheelSetRenderer,
    public readonly colorWheelConsumer: IColorWheelConsumer) {
  }

  public async execute(): Promise<void> {
    let colorWheelDefinitions: ColorWheelDefinition[] = [];

    const size = this.options.diameter + this.options.margin * 2;

    if (this.options.expand) {
      colorWheelDefinitions = [
        new ColorWheelDefinition(
          size,
          this.options.margin,
          this.options.angularBuckets,
          this.options.radialBuckets,
          this.options.fixed.map(v => this.createPixelRenderer(this.options.type, v))),
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
            this.createPixelRenderer(this.options.type, v),
          ]));
    }

    const image = this.colorWheelSetRenderer.render(colorWheelDefinitions, 0);

    await this.colorWheelConsumer.consume(image, this.options.outputFile);
  }

  private createPixelRenderer(type: ColorWheelType, fixed: number) {

    let radialBucketDirection: BucketDirection;
    if (!this.options.reverseRadialColors) {
      if (!this.options.reverseRadialBucketing) {
        radialBucketDirection = BucketDirection.up;
      }
      else {
        radialBucketDirection = BucketDirection.down;
      }
    }
    else {
      if (!this.options.reverseRadialBucketing) {
        radialBucketDirection = BucketDirection.down;
      }
      else {
        radialBucketDirection = BucketDirection.up;
      }
    }

    switch (this.options.type) {
      case ColorWheelType.hslFixedSaturation:
        return new HslFixedSaturationPixelRenderer(
         fixed, false, this.options.reverseRadialColors, BucketDirection.down, radialBucketDirection);

      case ColorWheelType.hslFixedLightness:
        return new HslFixedLightnessPixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, radialBucketDirection);

      case ColorWheelType.hsvFixedSaturation:
        return new HsvFixedSaturationPixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, radialBucketDirection);

      case ColorWheelType.hsvFixedValue:
        return new HsvFixedValuePixelRenderer(
          fixed, false, this.options.reverseRadialColors, BucketDirection.down, radialBucketDirection);

      default:
        throw new DisplayableError('Unexpected color wheel type: ' + type);
    }
  }
}

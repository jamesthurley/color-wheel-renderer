import { ICommand } from '../command';
import { IColorModelPixelRenderer } from '../../color-wheels/pixel-renderers/color-model-pixel-renderer';
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

    switch (this.options.type) {
      case ColorWheelType.HslFixedSaturation:
        if (this.options.expand) {
          colorWheelDefinitions = [
            new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.lightnessBuckets,
              this.options.saturation.map(
                v => new HslFixedSaturationPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up))),
          ];
        }
        else {
          colorWheelDefinitions =
            this.options.saturation.map(v => new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.lightnessBuckets,
              [
                new HslFixedSaturationPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up),
              ]));
        }
        break;

      case ColorWheelType.HslFixedLightness:
        if (this.options.expand) {
          colorWheelDefinitions = [
            new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.saturationBuckets,
              this.options.lightness.map(
                v => new HslFixedLightnessPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up))),
          ];
        }
        else {
          colorWheelDefinitions =
            this.options.lightness.map(v => new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.saturationBuckets,
              [
                new HslFixedLightnessPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up),
              ]));
        }
        break;

      case ColorWheelType.HsvFixedSaturation:
        if (this.options.expand) {
          colorWheelDefinitions = [
            new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.valueBuckets,
              this.options.saturation.map(
                v => new HsvFixedSaturationPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up))),
          ];
        }
        else {
          colorWheelDefinitions =
            this.options.saturation.map(v => new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.valueBuckets,
              [
                new HsvFixedSaturationPixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up),
              ]));
        }
        break;

      case ColorWheelType.HsvFixedValue:
        if (this.options.expand) {
          colorWheelDefinitions = [
            new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.saturationBuckets,
              this.options.value.map(
                v => new HsvFixedValuePixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up))),
          ];
        }
        else {
          colorWheelDefinitions =
            this.options.value.map(v => new ColorWheelDefinition(
              this.options.diameter,
              this.options.margin,
              this.options.hueBuckets,
              this.options.saturationBuckets,
              [
                new HsvFixedValuePixelRenderer(
                  v, false, this.options.reverseRadialColors, BucketDirection.down, this.options.reverseRadialColors ? BucketDirection.down : BucketDirection.up),
              ]));
        }
        break;

      default:
        throw new DisplayableError('Unexpected color wheel type.');
    }

    // const pixelRenderers: IColorModelPixelRenderer[] = [
    //   new HslFixedSaturationPixelRenderer(1, false, false, BucketDirection.down, BucketDirection.down),
    // ];

    // const pixelRenderers: IColorModelPixelRenderer[] = [
    //   new HsvFixedSaturationPixelRenderer(1, false, false, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(1, false, true, BucketDirection.down, BucketDirection.down),
    // ];

    // const pixelRenderers: IColorModelPixelRenderer[] = [
    //   new HslFixedLightnessPixelRenderer(0.9, false, false, BucketDirection.down, BucketDirection.down),
    //   new HslFixedLightnessPixelRenderer(0.75, false, false, BucketDirection.down, BucketDirection.down),
    //   new HslFixedLightnessPixelRenderer(0.5, false, false, BucketDirection.down, BucketDirection.down),
    //   new HslFixedLightnessPixelRenderer(0.25, false, false, BucketDirection.down, BucketDirection.down),
    //   new HslFixedLightnessPixelRenderer(0.1, false, false, BucketDirection.down, BucketDirection.down),
    // ];

    // const pixelRenderers: IColorModelPixelRenderer[] = [
    //   new HsvFixedValuePixelRenderer(1, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.8, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.6, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.4, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.2, false, true, BucketDirection.down, BucketDirection.down),
    // ];

    // const colorWheelDefinitions: ColorWheelDefinition[] = [
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     pixelRenderers),
    // ];

    // const colorWheelDefinitions: ColorWheelDefinition[] = [
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     [
    //       new HslFixedLightnessPixelRenderer(0.1, false, false, BucketDirection.down, BucketDirection.up),
    //     ]),
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     [
    //       new HslFixedLightnessPixelRenderer(0.3, false, false, BucketDirection.down, BucketDirection.up),
    //     ]),
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     [
    //       new HslFixedLightnessPixelRenderer(0.5, false, false, BucketDirection.down, BucketDirection.up),
    //     ]),
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     [
    //       new HslFixedLightnessPixelRenderer(0.7, false, false, BucketDirection.down, BucketDirection.up),
    //     ]),
    //   new ColorWheelDefinition(
    //     this.imageSize,
    //     this.borderSize,
    //     this.hueBuckets,
    //     this.saturationBuckets,
    //     [
    //       new HslFixedLightnessPixelRenderer(0.9, false, false, BucketDirection.down, BucketDirection.up),
    //     ]),
    // ];

    const image = this.colorWheelSetRenderer.render(colorWheelDefinitions, 0);

    image.write(this.options.outputFile);
    return Promise.resolve();
  }
}

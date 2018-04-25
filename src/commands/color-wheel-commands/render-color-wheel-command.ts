import { ICommand } from '../command';
import { IColorModelPixelRenderer } from '../../color-wheels/pixel-renderers/color-model-pixel-renderer';
import { HsvFixedValuePixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-value-pixel-renderer';
import { HsvFixedSaturationPixelRenderer } from '../../color-wheels/pixel-renderers/hsv-fixed-saturation-pixel-renderer';
import { ColorWheelDefinition } from '../../color-wheels/color-wheel-definition';
import { ColorWheelSetRenderer } from '../../color-wheels/color-wheel-set-renderer';
import { BucketDirection } from '../../color-wheels/bucket';

export class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly outputFile: string,
    public readonly imageSize: number,
    public readonly borderSize: number,
    public readonly hueBuckets: number,
    public readonly saturationBuckets: number,
    public readonly colorWheelSetRenderer: ColorWheelSetRenderer) {
  }

  public execute(): Promise<void> {
    const pixelRenderers: IColorModelPixelRenderer[] = [
      new HsvFixedSaturationPixelRenderer(1, false, false, BucketDirection.down, BucketDirection.down),
      new HsvFixedValuePixelRenderer(1, false, true, BucketDirection.down, BucketDirection.down),
    ];

    // const pixelRenderers: IColorModelPixelRenderer[] = [
    //   new HsvFixedValuePixelRenderer(1, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.8, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.6, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.4, false, true, BucketDirection.down, BucketDirection.down),
    //   new HsvFixedValuePixelRenderer(0.2, false, true, BucketDirection.down, BucketDirection.down),
    // ];

    const colorWheelDefinitions: ColorWheelDefinition[] = [
      new ColorWheelDefinition(
        this.imageSize,
        this.borderSize,
        this.hueBuckets,
        this.saturationBuckets,
        pixelRenderers),
    ];

    const image = this.colorWheelSetRenderer.render(colorWheelDefinitions, 0);

    image.write(this.outputFile);
    return Promise.resolve();
  }
}

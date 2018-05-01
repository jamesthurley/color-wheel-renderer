import { IColorModelPixelRenderer } from './pixel-renderers/color-model-pixel-renderer';

export class ColorWheelDefinition {
  constructor(
    public readonly size: number,
    public readonly marginSize: number,
    public readonly angleBuckets: number,
    public readonly distanceBuckets: number,
    public readonly pixelRenderers: ReadonlyArray<IColorModelPixelRenderer>) {
  }
}

import * as Jimp from 'jimp';
import { ColorWheelRenderer } from './color-wheel-renderer';
import { DisplayableError } from '../common/displayable-error';
import { ColorWheelDefinition } from './color-wheel-definition';
import { ensureRange } from './ensure-range';

export class ColorWheelSetRenderer {
  constructor(
    private readonly colorWheelRenderer: ColorWheelRenderer) {
  }

  public render(colorWheels: ReadonlyArray<ColorWheelDefinition>, spacing: number, supersample: number = 2): Jimp {
    if (!colorWheels || !colorWheels.length) {
      throw new DisplayableError('No color wheels defined.');
    }

    supersample = ensureRange(supersample, 1, 5);

    const overallHeight = Math.max(...colorWheels.map(v => v.size));
    const overallWidth = colorWheels.reduce((a, b) => a + b.size, 0) + (spacing * (colorWheels.length - 1));

    const image = new (Jimp as any)(overallWidth, overallHeight, 0xFFFFFFFF) as Jimp;
    let offsetX = 0;
    for (const colorWheel of colorWheels) {
      const renderedWheel = this.colorWheelRenderer.render(
        colorWheel.size * supersample,
        colorWheel.size * supersample,
        colorWheel.marginSize * supersample,
        colorWheel.angleBuckets,
        colorWheel.distanceBuckets,
        colorWheel.pixelRenderers);

      if (supersample > 1) {
        renderedWheel.resize(colorWheel.size, colorWheel.size);
      }

      image.composite(renderedWheel, offsetX, (overallHeight - colorWheel.size) / 2);
      offsetX += colorWheel.size + spacing;
    }

    return image;
  }
}

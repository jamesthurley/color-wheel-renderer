import { Pixel } from '../../common/pixel';
import { ensureRange } from '../ensure-range';

export abstract class HslPixelRendererBase {
  public renderInner(hue: number, saturation: number, lightness: number): Pixel {
    hue = ensureRange(hue, 0, 360);
    saturation = ensureRange(saturation, 0, 1);
    lightness = ensureRange(lightness, 0, 1);

    // https://www.rapidtables.com/convert/color/hsl-to-rgb.html
    const c = (1 - Math.abs((2 * lightness) - 1)) * saturation;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness - (c / 2);

    let i: Pixel;
    if (hue >= 0 && hue < 60) {
      i = new Pixel(c, x, 0);
    }
    else if (hue >= 60 && hue < 120) {
      i = new Pixel(x, c, 0);
    }
    else if (hue >= 120 && hue < 180) {
      i = new Pixel(0, c, x);
    }
    else if (hue >= 180 && hue < 240) {
      i = new Pixel(0, x, c);
    }
    else if (hue >= 240 && hue < 300) {
      i = new Pixel(x, 0, c);
    }
    else {
      i = new Pixel(c, 0, x);
    }

    const r = (i.red + m) * 255;
    const g = (i.green + m) * 255;
    const b = (i.blue + m) * 255;

    return new Pixel(r, g, b);
  }
}

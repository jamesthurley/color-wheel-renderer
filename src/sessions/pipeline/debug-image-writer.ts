import * as Jimp from 'jimp';

export class DebugImageWriter {
  constructor(
    public readonly image: Jimp | undefined) {
  }

  public setPixelColor(hex: number, x: number, y: number, cb?: Jimp.ImageCallback | undefined): this {
    if (this.image) {
      this.image.setPixelColor(hex, x, y, cb);
    }

    return this;
  }
}

import * as Jimp from 'jimp';
import { Pixel } from './pixel';

export function getPixelAtIndex(image: Jimp, index: number): Pixel {
  const red = image.bitmap.data[index + 0];
  const green = image.bitmap.data[index + 1];
  const blue = image.bitmap.data[index + 2];

  return new Pixel(red, green, blue);
}

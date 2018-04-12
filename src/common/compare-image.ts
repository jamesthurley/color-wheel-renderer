import * as Jimp from 'jimp';
import { getPixelAtIndex } from './get-pixel-at-index';

export function compareImage(expected: Jimp, actual: Jimp): Promise<ImageComparisonResult> {
  const messages: string[] = [];
  if (expected.bitmap.width !== actual.bitmap.width) {
    messages.push(`Image width does not match. Expected: ${expected.bitmap.width}px, Actual: ${actual.bitmap.width}.`);
  }

  if (expected.bitmap.height !== actual.bitmap.height) {
    messages.push(`Image height does not match. Expected: ${expected.bitmap.height}px, Actual: ${actual.bitmap.height}.`);
  }

  const comparisonImage = expected.clone().composite(actual.clone().invert().opacity(0.5), 0, 0);
  const width = comparisonImage.bitmap.width;
  const height = comparisonImage.bitmap.height;
  const expectedPixelValue = 127;
  const maximumAllowedDifference = 0;

  let sumOfDifferences = 0;
  let differencesCount = 0;
  comparisonImage.scan(0, 0, width, height, (x, y, index) => {
    const pixel = getPixelAtIndex(comparisonImage, index);
    const meanDifference = (Math.abs(pixel.red - expectedPixelValue) + Math.abs(pixel.green - expectedPixelValue) + Math.abs(pixel.blue - expectedPixelValue)) / 3;
    if (meanDifference > 0) {
      sumOfDifferences += meanDifference;
      ++differencesCount;
    }
  });

  if (sumOfDifferences > maximumAllowedDifference) {
    messages.push(`Image data does not match. ${differencesCount} pixel(s) out of ${width * height} were different. Sum of mean differences was: ${sumOfDifferences}.`);
  }

  return Promise.resolve(new ImageComparisonResult(messages));
}

export class ImageComparisonResult {
  constructor(public readonly differences: ReadonlyArray<string>) {
  }
}

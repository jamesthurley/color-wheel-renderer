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
  const pixelDifferenceTolerance = 1; // Should be at least 1 or a pure white pixel triggers a difference.

  let sumOfDifferences = 0;
  let differencesCount = 0;
  const nonMatchingPixelIndexes: number[] = [];
  comparisonImage.scan(0, 0, width, height, (x, y, index) => {
    const pixel = getPixelAtIndex(comparisonImage, index);
    const meanDifference = (Math.abs(pixel.red - expectedPixelValue) + Math.abs(pixel.green - expectedPixelValue) + Math.abs(pixel.blue - expectedPixelValue)) / 3;
    if (meanDifference > pixelDifferenceTolerance) {
      sumOfDifferences += meanDifference;
      ++differencesCount;
      nonMatchingPixelIndexes.push(index);
    }
  });

  if (sumOfDifferences > 0) {
    messages.push(`Image data does not match. ${differencesCount} pixel(s) out of ${width * height} were beyond tolerance. Sum of mean differences was: ${sumOfDifferences}.`);
    messages.push(`Image dimensions: ${width}x${height}.`);

    const logPixel = (index: number, position: string) => {
      const expectedPixel = getPixelAtIndex(expected, index);
      const actualPixel = getPixelAtIndex(actual, index);
      const pixelIndex = index / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      messages.push(
        `${position} non-matching pixel at ${x},${y}: Expected ${expectedPixel.toString()}. Actual: ${actualPixel.toString()}.`);
    };

    if (nonMatchingPixelIndexes.length > 0) {
      const index =  nonMatchingPixelIndexes[0];
      logPixel(index, 'First');
    }

    if (nonMatchingPixelIndexes.length > 1) {
      const index = nonMatchingPixelIndexes[nonMatchingPixelIndexes.length - 1];
      logPixel(index, 'Last');
    }
  }

  return Promise.resolve(new ImageComparisonResult(messages));
}

export class ImageComparisonResult {
  constructor(public readonly differences: ReadonlyArray<string>) {
  }
}

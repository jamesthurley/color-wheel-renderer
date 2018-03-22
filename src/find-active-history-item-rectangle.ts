import * as Jimp from 'jimp';
import { IRectangle, Rectangle } from './rectangle';
import { Log } from './log';

// We'll try and support retina/high density displays by trying larger
// offsets in sequence.
const pixelRatioMultipliers: number[] = [
  1,
  2,
  3,
];

const borderLeftIndexOffsetBase: number = 15;
let detectedPixelRatio: number = 0;

export function findActiveHistoryItemRectangle(image: Jimp, borderLeftIndex: number): IRectangle {
  if (detectedPixelRatio) {
    // Log.info(`Finding history item for ${detectedPixelRatio}x pixel ratio.`);
    return findActiveHistoryItemRectangleForOffset(
      image,
      borderLeftIndex,
      detectedPixelRatio * borderLeftIndexOffsetBase);
  }

  for (const multiplier of pixelRatioMultipliers) {
    Log.info(`Attempting to find history item for ${multiplier}x pixel ratio.`);
    const result = findActiveHistoryItemRectangleForOffset(
      image,
      borderLeftIndex,
      multiplier * borderLeftIndexOffsetBase);

    if (result) {
      detectedPixelRatio = multiplier;
      return result;
    }
  }

  return null;
}

function findActiveHistoryItemRectangleForOffset(
  image: Jimp,
  borderLeftIndex: number,
  borderLeftIndexOffset: number): IRectangle {

  const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

  const top = findActiveHistoryItemTop(image, xSearchIndex);
  if (!top) {
    Log.error('Active history item top border not found.');
    return null;
  }

  const right = findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
  if (!right) {
    Log.error('Active history item right border not found.');
    return null;
  }

  const bottom = findActiveHistoryItemBottom(image, right, top);
  if (!bottom) {
    Log.error('Active history item bottom border not found.');
    return null;
  }

  const left = findActiveHistoryItemLeft(image, right, top);
  if (!left) {
    Log.error('Active history item left border not found.');
    return null;
  }

  return new Rectangle(
    left,
    top,
    right - left,
    bottom - top);
}

function findActiveHistoryItemTop(image: Jimp, xSearchIndex: number) {
  const requiredConsecutiveBorderColorCount = 10;
  let consecutiveBorderColorCount = 0;
  let top: number;
  image.scan(xSearchIndex, 0, 1, image.bitmap.height, (x, y, index) => {
    if (top) {
      return;
    }

    if (isActiveHistoryItemAtIndex(image, index)) {
      consecutiveBorderColorCount++;
    }
    else {
      consecutiveBorderColorCount = 0;
    }

    if (consecutiveBorderColorCount === requiredConsecutiveBorderColorCount) {
      top = (y - requiredConsecutiveBorderColorCount) + 1;
    }
  });

  return top;
}

function findActiveHistoryItemRight(image: Jimp, xSearchIndex: number, top: number, maximumScanLength: number): number {
  let right: number;
  image.scan(xSearchIndex, top, maximumScanLength, 1, (x, y, index) => {
    if (right) {
      return;
    }

    if (!isActiveHistoryItemAtIndex(image, index)) {
      right = x - 1;
    }
  });

  return right;
}

function findActiveHistoryItemBottom(image: Jimp, right: number, top: number): number {
  let bottom: number;
  image.scan(right, top, 1, image.bitmap.height - top, (x, y, index) => {
    if (bottom) {
      return;
    }

    if (!isActiveHistoryItemAtIndex(image, index)) {
      bottom = y - 1;
    }
  });

  return bottom;
}

function findActiveHistoryItemLeft(image: Jimp, right: number, top: number): number {
  let left: number;
  for (let x = right - 1; x >= 0; --x) {
    const index = image.getPixelIndex(x, top);
    if (!isActiveHistoryItemAtIndex(image, index)) {
      left = x + 1;
      break;
    }
  }

  return left;
}

function isActiveHistoryItemAtIndex(image: Jimp, index: number): boolean {
  const red = image.bitmap.data[index + 0];
  const green = image.bitmap.data[index + 1];
  const blue = image.bitmap.data[index + 2];

  return isActiveHistoryItem(red, green, blue);
}

function isActiveHistoryItem(r: number, g: number, b: number): boolean {
  return isActiveHistoryItemColor(r) && isActiveHistoryItemColor(g) && isActiveHistoryItemColor(b);
}

function isActiveHistoryItemColor(color: number) {
  return isWindowsLightroomActiveHistoryItemColor(color) || isMacLightroomActiveHistoryItemColor(color);
}

function isWindowsLightroomActiveHistoryItemColor(color: number): boolean {
  const min: number = 177;
  const max: number = 179;
  return color >= min && color <= max;
}

function isMacLightroomActiveHistoryItemColor(color: number): boolean {
  const min: number = 190;
  const max: number = 220;
  return color >= min && color <= max;
}

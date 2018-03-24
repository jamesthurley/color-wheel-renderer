import { SnapshotSourceBase } from './snapshot-source-base';
import * as Jimp from 'jimp';
import { IRectangle, Rectangle } from '../common/rectangle';
import { Log } from '../common/log';
import { DisplayableError } from '../common/displayable-error';

// We'll try and support retina/high density displays by trying larger
// offsets in sequence.
const pixelRatioMultipliers: number[] = [
  1,
  2,
  3,
];

const borderLeftIndexOffsetBase: number = 15;
let detectedPixelRatio: number = 0;

const DIMENSION_INDEX_X = 0;
const DIMENSION_INDEX_Y = 1;

enum BorderSearchState {
  noBorderFound,
  firstBorderFound,
  withinPhoto,
}

export abstract class LightroomSource extends SnapshotSourceBase {

  private photoBorderLeftIndex: number;

  public findPhotoRectangle(image: Jimp): IRectangle | null {
    const xBorders = this.findPhotoBorders(image, DIMENSION_INDEX_X);
    const yBorders = this.findPhotoBorders(image, DIMENSION_INDEX_Y);

    if (!xBorders || !yBorders) {
      return null;
    }

    this.photoBorderLeftIndex = xBorders.borderStartIndex;

    return new Rectangle(
      xBorders.photoStartIndex,
      yBorders.photoStartIndex,
      xBorders.photoEndIndex - xBorders.photoStartIndex,
      yBorders.photoEndIndex - yBorders.photoStartIndex);
  }

  public findActiveHistoryItemRectangle(image: Jimp): IRectangle | null {

    if(!this.photoBorderLeftIndex){
      throw new DisplayableError('Photo left border position not set. Ensure a photo has been located.');
    }

    if (detectedPixelRatio) {
      // Log.info(`Finding history item for ${detectedPixelRatio}x pixel ratio.`);
      return this.findActiveHistoryItemRectangleForOffset(
        image,
        this.photoBorderLeftIndex,
        detectedPixelRatio * borderLeftIndexOffsetBase);
    }

    for (const multiplier of pixelRatioMultipliers) {
      Log.info(`Attempting to find history item for ${multiplier}x pixel ratio.`);
      const result = this.findActiveHistoryItemRectangleForOffset(
        image,
        this.photoBorderLeftIndex,
        multiplier * borderLeftIndexOffsetBase);

      if (result) {
        detectedPixelRatio = multiplier;
        return result;
      }
    }

    return null;
  }

  protected abstract isPhotoBorderColor(r: number, g: number, b: number): boolean;
  protected abstract isActiveHistoryItemColor(r: number, g: number, b: number): boolean;

  private findPhotoBorders(image: Jimp, dimensionIndex: number) {
    const requiredConsecutiveBorderColorCount = 10;

    let state = BorderSearchState.noBorderFound;
    let consecutiveBorderColorCount = 0;

    let borderStartIndex: ReadonlyArray<number> = null;
    let photoStartIndex: ReadonlyArray<number> = null;
    let photoEndIndex: ReadonlyArray<number> = null;

    const scanX = dimensionIndex === DIMENSION_INDEX_X ? 0 : image.bitmap.width / 2;
    const scanY = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.height / 2 : 0;
    const scanW = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.width : 1;
    const scanH = dimensionIndex === DIMENSION_INDEX_X ? 1 : image.bitmap.height;

    image.scan(scanX, scanY, scanW, scanH, (x, y, index) => {
      if (photoEndIndex) {
        return;
      }

      const red = image.bitmap.data[index + 0];
      const green = image.bitmap.data[index + 1];
      const blue = image.bitmap.data[index + 2];

      if (this.isPhotoBorderColor(red, green, blue)) {
        consecutiveBorderColorCount++;
      }
      else {
        consecutiveBorderColorCount = 0;

        switch (state) {
          case BorderSearchState.noBorderFound:
            break;

          case BorderSearchState.firstBorderFound:
            state = BorderSearchState.withinPhoto;
            photoStartIndex = [x, y];
            break;

          case BorderSearchState.withinPhoto:
            break;

          default:
            throw new Error('Unexpected state.');
        }
      }

      if (consecutiveBorderColorCount === requiredConsecutiveBorderColorCount) {
        switch (state) {
          case BorderSearchState.noBorderFound:
            borderStartIndex = [
              (x - requiredConsecutiveBorderColorCount) + 1,
              (y - requiredConsecutiveBorderColorCount) + 1];
            state = BorderSearchState.firstBorderFound;
            break;

          case BorderSearchState.firstBorderFound:
            break;

          case BorderSearchState.withinPhoto:
            photoEndIndex = [
              (x - requiredConsecutiveBorderColorCount) + 1,
              (y - requiredConsecutiveBorderColorCount) + 1];
            break;

          default:
            throw new Error('Unexpected state.');
        }
      }
    });

    if (!borderStartIndex) {
      Log.error('Photo border not found.');
      return null;
    }
    else if (!photoStartIndex) {
      Log.error('Photo start position not found.');
      return null;
    }
    else if (!photoEndIndex) {
      Log.error('Photo end position not found.');
      return null;
    }

    return {
      photoStartIndex: photoStartIndex[dimensionIndex],
      photoEndIndex: photoEndIndex[dimensionIndex],
      borderStartIndex: borderStartIndex[dimensionIndex],
    };
  }

  private findActiveHistoryItemRectangleForOffset(
    image: Jimp,
    borderLeftIndex: number,
    borderLeftIndexOffset: number): IRectangle {

    const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

    const top = this.findActiveHistoryItemTop(image, xSearchIndex);
    if (!top) {
      Log.error('Active history item top border not found.');
      return null;
    }

    const right = this.findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
    if (!right) {
      Log.error('Active history item right border not found.');
      return null;
    }

    const bottom = this.findActiveHistoryItemBottom(image, right, top);
    if (!bottom) {
      Log.error('Active history item bottom border not found.');
      return null;
    }

    const left = this.findActiveHistoryItemLeft(image, right, top);
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

  private findActiveHistoryItemTop(image: Jimp, xSearchIndex: number) {
    const requiredConsecutiveBorderColorCount = 10;
    let consecutiveBorderColorCount = 0;
    let top: number;
    image.scan(xSearchIndex, 0, 1, image.bitmap.height, (x, y, index) => {
      if (top) {
        return;
      }

      if (this.isActiveHistoryItemAtIndex(image, index)) {
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

  private findActiveHistoryItemRight(image: Jimp, xSearchIndex: number, top: number, maximumScanLength: number): number {
    let right: number;
    image.scan(xSearchIndex, top, maximumScanLength, 1, (x, y, index) => {
      if (right) {
        return;
      }

      if (!this.isActiveHistoryItemAtIndex(image, index)) {
        right = x - 1;
      }
    });

    return right;
  }

  private findActiveHistoryItemBottom(image: Jimp, right: number, top: number): number {
    let bottom: number;
    image.scan(right, top, 1, image.bitmap.height - top, (x, y, index) => {
      if (bottom) {
        return;
      }

      if (!this.isActiveHistoryItemAtIndex(image, index)) {
        bottom = y - 1;
      }
    });

    return bottom;
  }

  private findActiveHistoryItemLeft(image: Jimp, right: number, top: number): number {
    let left: number;
    for (let x = right - 1; x >= 0; --x) {
      const index = image.getPixelIndex(x, top);
      if (!this.isActiveHistoryItemAtIndex(image, index)) {
        left = x + 1;
        break;
      }
    }

    return left;
  }

  private isActiveHistoryItemAtIndex(image: Jimp, index: number): boolean {
    const red = image.bitmap.data[index + 0];
    const green = image.bitmap.data[index + 1];
    const blue = image.bitmap.data[index + 2];

    return this.isActiveHistoryItemColor(red, green, blue);
  }
}




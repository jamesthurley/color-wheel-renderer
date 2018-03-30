import { EditorBase, Pixel } from './editor-base';
import * as Jimp from 'jimp';
import { IRectangle, Rectangle } from '../common/rectangle';
import { Log } from '../common/log';
import { DisplayableError } from '../common/displayable-error';
import { isUndefined } from 'util';

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

export abstract class LightroomEditor extends EditorBase {

  private photoBorderLeftIndex: number;

  public findPhotoRectangle(image: Jimp): IRectangle | undefined {
    const xBorders = this.findPhotoBorders(image, DIMENSION_INDEX_X);
    const yBorders = this.findPhotoBorders(image, DIMENSION_INDEX_Y);

    if (!xBorders || !yBorders) {
      return undefined;
    }

    this.photoBorderLeftIndex = xBorders.borderStartIndex;

    return new Rectangle(
      xBorders.photoStartIndex,
      yBorders.photoStartIndex,
      xBorders.photoEndIndex - xBorders.photoStartIndex,
      yBorders.photoEndIndex - yBorders.photoStartIndex);
  }

  public findActiveHistoryItemRectangle(image: Jimp): IRectangle | undefined {

    if (!this.photoBorderLeftIndex){
      throw new DisplayableError('Photo left border position not set. Ensure a photo has been located.');
    }

    if (detectedPixelRatio) {
      Log.verbose(`Finding history item for ${detectedPixelRatio}x pixel ratio.`);
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

    return undefined;
  }

  protected abstract isPhotoBorderColor(pixel: Pixel): boolean;
  protected abstract isActiveHistoryItemColor(pixel: Pixel): boolean;

  private findPhotoBorders(image: Jimp, dimensionIndex: number) {
    const requiredConsecutiveBorderColorCount = 10;

    let state = BorderSearchState.noBorderFound;
    let consecutiveBorderColorCount = 0;

    let borderStartIndex: ReadonlyArray<number> | undefined;
    let photoStartIndex: ReadonlyArray<number> | undefined;
    let photoEndIndex: ReadonlyArray<number> | undefined;

    const scanX = dimensionIndex === DIMENSION_INDEX_X ? 0 : image.bitmap.width / 2;
    const scanY = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.height / 2 : 0;
    const scanW = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.width : 1;
    const scanH = dimensionIndex === DIMENSION_INDEX_X ? 1 : image.bitmap.height;

    Log.verbose(`Scanning for photo borders. x:${scanX}, y:${scanY}, width:${scanW}, height:${scanH}`);
    image.scan(scanX, scanY, scanW, scanH, (x, y, index) => {
      if (photoEndIndex) {
        return;
      }

      const pixel = this.getPixelAtIndex(image, index);

      if (this.isPhotoBorderColor(pixel)) {
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
      return undefined;
    }
    else if (!photoStartIndex) {
      Log.error('Photo start position not found.');
      return undefined;
    }
    else if (!photoEndIndex) {
      Log.error('Photo end position not found.');
      return undefined;
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
    borderLeftIndexOffset: number): IRectangle | undefined {

    const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

    const top = this.findActiveHistoryItemTop(image, xSearchIndex);
    if (isUndefined(top)) {
      Log.error('Active history item top border not found.');
      return undefined;
    }

    const right = this.findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
    if (isUndefined(right)) {
      Log.error('Active history item right border not found.');
      return undefined;
    }

    const bottom = this.findActiveHistoryItemBottom(image, right, top);
    if (isUndefined(bottom)) {
      Log.error('Active history item bottom border not found.');
      return undefined;
    }

    const left = this.findActiveHistoryItemLeft(image, right, top);
    if (isUndefined(left)) {
      Log.error('Active history item left border not found.');
      return undefined;
    }

    return new Rectangle(
      left,
      top,
      right - left,
      bottom - top);
  }

  private findActiveHistoryItemTop(image: Jimp, xSearchIndex: number): number | undefined {
    const requiredConsecutiveBorderColorCount = 10;
    let consecutiveBorderColorCount = 0;
    let top: number | undefined;
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

  private findActiveHistoryItemRight(image: Jimp, xSearchIndex: number, top: number, maximumScanLength: number): number | undefined {
    let right: number | undefined;
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

  private findActiveHistoryItemBottom(image: Jimp, right: number, top: number): number | undefined {
    let bottom: number | undefined;
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

  private findActiveHistoryItemLeft(image: Jimp, right: number, top: number): number | undefined {
    let left: number | undefined;
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
    const pixel = this.getPixelAtIndex(image, index);
    return this.isActiveHistoryItemColor(pixel);
  }
}

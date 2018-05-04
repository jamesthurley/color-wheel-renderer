import { EditorBase } from './editor-base';
import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';
import { DisplayableError } from '../../common/displayable-error';
import { isUndefined } from 'util';
import { Border } from '../../common/border';
import { getPixelAtIndex } from '../../common/get-pixel-at-index';
import { Pixel } from '../../common/pixel';
import { VoteTally } from '../../common/vote-tally';

const DIMENSION_INDEX_X = 0;
const DIMENSION_INDEX_Y = 1;

enum BorderSearchState {
  noBorderFound,
  firstBorderFound,
  withinPhoto,
}

class PhotoBorderPositions {
  constructor(
    public readonly photoStartIndex: number,
    public readonly photoEndIndex: number,
    public readonly borderStartIndex: number) {
  }
}

export abstract class LightroomEditor extends EditorBase {

  private photoBorderLeftIndex: number = 0;

  public findPhotoRectangle(image: Jimp): IRectangle | undefined {
    const xBorders = this.findPhotoBorders(image, DIMENSION_INDEX_X);
    const yBorders = this.findPhotoBorders(image, DIMENSION_INDEX_Y);

    if (!xBorders || !yBorders) {
      return undefined;
    }

    this.photoBorderLeftIndex = xBorders.borderStartIndex;

    const border = new Border(
      xBorders.photoStartIndex,
      yBorders.photoStartIndex,
      xBorders.photoEndIndex,
      yBorders.photoEndIndex);

    return border.toRectangle();
  }

  // This method will search several offsets for the history item rectangle, and return the most popular guess.
  public findActiveHistoryItemRectangle(image: Jimp): IRectangle | undefined {
    if (!this.photoBorderLeftIndex) {
      throw new DisplayableError('Photo left border position not set. Ensure a photo has been located.');
    }

    const borderLeftIndexOffsetBase: number = 5;
    const pixelsBetweenOffsets: number = 2;
    const maximumOffsetsToSearch: number = 20;

    const tally = new VoteTally<IRectangle>('Active History Item');
    for (let i = 0; i < maximumOffsetsToSearch; ++i) {
      tally.castVote(this.findActiveHistoryItemRectangleAtOffset(
        image,
        this.photoBorderLeftIndex,
        borderLeftIndexOffsetBase + (i * pixelsBetweenOffsets)));
    }

    return tally.winner;
  }

  protected abstract isPhotoBorderColor(pixel: Pixel): boolean;

  protected abstract isActiveHistoryItemColor(pixel: Pixel): boolean;

  // This method will search several offsets for the photo borders, and return the most popular guess.
  private findPhotoBorders(image: Jimp, dimensionIndex: number): PhotoBorderPositions | undefined {
    const maximumSearchOffsets: number = 5;
    const offsetSizePixels: number = 20;
    const halfMaximumSearchOffsets: number = Math.floor(maximumSearchOffsets / 2);
    const offsets = Array(maximumSearchOffsets).fill(0).map((v, i) => (i - halfMaximumSearchOffsets) * offsetSizePixels);

    const tally = new VoteTally<PhotoBorderPositions>(`Photo Border ${dimensionIndex === DIMENSION_INDEX_X ? 'Left/Right' : 'Top/Bottom'}`);
    for (const offset of offsets) {
      tally.castVote(this.findPhotoBordersAtOffset(image, dimensionIndex, offset));
    }

    return tally.winner;
  }

  private findPhotoBordersAtOffset(image: Jimp, dimensionIndex: number, searchOffset: number): PhotoBorderPositions | undefined {
    const requiredConsecutiveBorderColorCount = 10;

    let state = BorderSearchState.noBorderFound;
    let consecutiveBorderColorCount = 0;

    let borderStartIndex: ReadonlyArray<number> | undefined;
    let photoStartIndex: ReadonlyArray<number> | undefined;
    let photoEndIndex: ReadonlyArray<number> | undefined;

    const scanX = dimensionIndex === DIMENSION_INDEX_X ? 0 : (image.bitmap.width / 2) + searchOffset;
    const scanY = dimensionIndex === DIMENSION_INDEX_X ? (image.bitmap.height / 2) + searchOffset : 0;
    const scanW = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.width : 1;
    const scanH = dimensionIndex === DIMENSION_INDEX_X ? 1 : image.bitmap.height;

    // Log.verbose(`Scanning for photo borders. x:${scanX}, y:${scanY}, width:${scanW}, height:${scanH}`);
    image.scan(scanX, scanY, scanW, scanH, (x, y, index) => {
      if (photoEndIndex) {
        return;
      }

      const pixel = getPixelAtIndex(image, index);

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
              (x - requiredConsecutiveBorderColorCount),
              (y - requiredConsecutiveBorderColorCount)];
            break;

          default:
            throw new Error('Unexpected state.');
        }
      }
    });

    if (!borderStartIndex) {
      // Log.error('Photo border not found.');
      return undefined;
    }
    else if (!photoStartIndex) {
      // Log.error('Photo start position not found.');
      return undefined;
    }
    else if (!photoEndIndex) {
      // Log.error('Photo end position not found.');
      return undefined;
    }

    return new PhotoBorderPositions(
      photoStartIndex[dimensionIndex],
      photoEndIndex[dimensionIndex],
      borderStartIndex[dimensionIndex]);
  }

  private findActiveHistoryItemRectangleAtOffset(
    image: Jimp,
    borderLeftIndex: number,
    borderLeftIndexOffset: number): IRectangle | undefined {

    const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

    // Log.verbose(`Scanning for active history item at offset ${borderLeftIndexOffset}, x:${xSearchIndex}.`);

    const top = this.findActiveHistoryItemTop(image, xSearchIndex);
    if (isUndefined(top)) {
      // Log.verbose('Active history item top border not found.');
      return undefined;
    }

    const right = this.findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
    if (isUndefined(right)) {
      // Log.error('Active history item right border not found.');
      return undefined;
    }

    const bottom = this.findActiveHistoryItemBottom(image, right, top);
    if (isUndefined(bottom)) {
      // Log.error('Active history item bottom border not found.');
      return undefined;
    }

    const left = this.findActiveHistoryItemLeft(image, right, top);
    if (isUndefined(left)) {
      // Log.error('Active history item left border not found.');
      return undefined;
    }

    const border = new Border(left, top, right, bottom);

    return border.toRectangle();
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
    const pixel = getPixelAtIndex(image, index);
    return this.isActiveHistoryItemColor(pixel);
  }
}

import { EditorBase } from './editor-base';
import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';
import { DisplayableError } from '../../common/displayable-error';
import { isUndefined } from 'util';
import { Border } from '../../common/border';
import { getPixelAtIndex } from '../../common/get-pixel-at-index';
import { Pixel } from '../../common/pixel';
import { VoteTally, TallySortMode } from '../../common/vote-tally';
import { WithDebugImages } from '../pipeline/with-debug-images';
import { DebugImage } from '../pipeline/debug-image';
import { Constants } from '../../common/constants';
import { DebugImageWriter } from '../pipeline/debug-image-writer';
import { Log } from '../../common/log';

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

  private photoBorderTopIndex: number = 0;
  private photoBorderLeftIndex: number = 0;

  public findPhotoRectangle(image: Jimp): WithDebugImages<IRectangle | undefined> {
    const debugImageData = this.createDebugImage(image, 'photo.debug.png');
    const xBorders = this.findPhotoBorders(image, debugImageData.writer, DIMENSION_INDEX_X);
    const yBorders = this.findPhotoBorders(image, debugImageData.writer, DIMENSION_INDEX_Y);

    if (!xBorders || !yBorders) {
      return new WithDebugImages<IRectangle | undefined>(undefined, debugImageData.list);
    }

    this.photoBorderTopIndex = yBorders.borderStartIndex;
    this.photoBorderLeftIndex = xBorders.borderStartIndex;

    const border = new Border(
      xBorders.photoStartIndex,
      yBorders.photoStartIndex,
      xBorders.photoEndIndex,
      yBorders.photoEndIndex);

    return new WithDebugImages<IRectangle | undefined>(border.toRectangle(), debugImageData.list);
  }

  // This method will search several offsets for the history item rectangle, and return the most popular guess.
  public findActiveHistoryItemRectangle(image: Jimp): WithDebugImages<IRectangle | undefined> {
    if (!this.photoBorderLeftIndex) {
      throw new DisplayableError('Photo left border position not set. Ensure a photo has been located.');
    }

    if (!this.photoBorderTopIndex) {
      throw new DisplayableError('Photo top border position not set. Ensure a photo has been located.');
    }

    const debugImageData = this.createDebugImage(image, 'history-item.debug.png');

    const borderLeftIndexOffsetBase: number = 5;
    const pixelsBetweenOffsets: number = 2;
    const maximumOffsetsToSearch: number = 20;

    const tally = new VoteTally<IRectangle>('Active History Item');
    for (let i = 0; i < maximumOffsetsToSearch; ++i) {
      tally.castVote(this.findActiveHistoryItemRectangleAtOffset(
        image,
        debugImageData.writer,
        this.photoBorderTopIndex,
        this.photoBorderLeftIndex,
        borderLeftIndexOffsetBase + (i * pixelsBetweenOffsets)));
    }

    return new WithDebugImages<IRectangle | undefined>(tally.winner, debugImageData.list);
  }

  protected abstract isPhotoBorderColor(pixel: Pixel): boolean;

  protected abstract isActiveHistoryItemColor(pixel: Pixel): boolean;

  private createDebugImage(sourceImage: Jimp, fileName: string): { list: ReadonlyArray<DebugImage>, writer: DebugImageWriter } {
    const debugImages: DebugImage[] = [];
    let debugImageWriter: DebugImageWriter = new DebugImageWriter(undefined);
    if (Log.isVerbose) {
      const debugImage = new DebugImage(fileName, sourceImage.clone());
      debugImages.push(debugImage);
      debugImageWriter = new DebugImageWriter(debugImage.image);
    }

    return {
      list: debugImages,
      writer: debugImageWriter,
    };
  }

  // This method will search several offsets for the photo borders, and return the most popular guess.
  private findPhotoBorders(image: Jimp, debug: DebugImageWriter, dimensionIndex: number): PhotoBorderPositions | undefined {
    const maximumSearchOffsets: number = 50;
    const offsetSizePixels: number = 15;
    const halfMaximumSearchOffsets: number = Math.floor(maximumSearchOffsets / 2);
    const offsets = Array(maximumSearchOffsets).fill(0).map((v, i) => (i - halfMaximumSearchOffsets) * offsetSizePixels);

    // Largest photo size wins.
    const tally = new VoteTally<PhotoBorderPositions>(
      `Photo Border ${dimensionIndex === DIMENSION_INDEX_X ? 'Left/Right' : 'Top/Bottom'}`,
      border => border.photoEndIndex - border.photoStartIndex,
      TallySortMode.quantifierThenVotes);

    for (const offset of offsets) {
      tally.castVote(this.findPhotoBordersAtOffset(image, debug, dimensionIndex, offset));
    }

    return tally.winner;
  }

  private findPhotoBordersAtOffset(image: Jimp, debug: DebugImageWriter, dimensionIndex: number, searchOffset: number): PhotoBorderPositions | undefined {
    const requiredConsecutiveBorderColorCount = 6;

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
        debug.setPixelColor(Constants.ColorOrange, x, y);
      }
      else {
        consecutiveBorderColorCount = 0;

        switch (state) {
          case BorderSearchState.noBorderFound:
            debug.setPixelColor(Constants.ColorRed, x, y);
            break;

          case BorderSearchState.firstBorderFound:
            state = BorderSearchState.withinPhoto;
            photoStartIndex = [x, y];
            debug.setPixelColor(Constants.ColorGreen, x, y);
            break;

          case BorderSearchState.withinPhoto:
            debug.setPixelColor(Constants.ColorGreen, x, y);
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
    debug: DebugImageWriter,
    borderTopIndex: number,
    borderLeftIndex: number,
    borderLeftIndexOffset: number): IRectangle | undefined {

    const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

    // Log.verbose(`Scanning for active history item at offset ${borderLeftIndexOffset}, x:${xSearchIndex}.`);

    const top = this.findActiveHistoryItemTop(image, debug, xSearchIndex, borderTopIndex);
    if (isUndefined(top)) {
      // Log.verbose('Active history item top border not found.');
      return undefined;
    }

    const right = this.findActiveHistoryItemRight(image, debug, xSearchIndex, top, borderLeftIndexOffset);
    if (isUndefined(right)) {
      // Log.error('Active history item right border not found.');
      return undefined;
    }

    const bottom = this.findActiveHistoryItemBottom(image, debug, right, top);
    if (isUndefined(bottom)) {
      // Log.error('Active history item bottom border not found.');
      return undefined;
    }

    const left = this.findActiveHistoryItemLeft(image, debug, right, top);
    if (isUndefined(left)) {
      // Log.error('Active history item left border not found.');
      return undefined;
    }

    const border = new Border(left, top, right, bottom);

    return border.toRectangle();
  }

  private findActiveHistoryItemTop(image: Jimp, debug: DebugImageWriter, xSearchIndex: number, borderTopIndex: number): number | undefined {
    const requiredConsecutiveBorderColorCount = 10;
    let consecutiveBorderColorCount = 0;
    let top: number | undefined;
    image.scan(xSearchIndex, borderTopIndex, 1, image.bitmap.height - borderTopIndex, (x, y, index) => {
      if (top) {
        return;
      }

      if (this.isActiveHistoryItemAtIndex(image, index)) {
        consecutiveBorderColorCount++;
        debug.setPixelColor(Constants.ColorOrange, x, y);
      }
      else {
        consecutiveBorderColorCount = 0;
        debug.setPixelColor(Constants.ColorRed, x, y);
      }

      if (consecutiveBorderColorCount === requiredConsecutiveBorderColorCount) {
        top = (y - requiredConsecutiveBorderColorCount) + 1;
        debug.setPixelColor(Constants.ColorGreen, x, y);
      }
    });

    return top;
  }

  private findActiveHistoryItemRight(image: Jimp, debug: DebugImageWriter, xSearchIndex: number, top: number, maximumScanLength: number): number | undefined {
    let right: number | undefined;
    image.scan(xSearchIndex, top, maximumScanLength, 1, (x, y, index) => {
      if (right) {
        return;
      }

      if (this.isActiveHistoryItemAtIndex(image, index)) {
        debug.setPixelColor(Constants.ColorOrange, x, y);
      }
      else {
        right = x - 1;
        debug.setPixelColor(Constants.ColorGreen, x, y);
      }
    });

    return right;
  }

  private findActiveHistoryItemBottom(image: Jimp, debug: DebugImageWriter, right: number, top: number): number | undefined {
    let bottom: number | undefined;
    image.scan(right, top, 1, image.bitmap.height - top, (x, y, index) => {
      if (bottom) {
        return;
      }

      if (this.isActiveHistoryItemAtIndex(image, index)) {
        debug.setPixelColor(Constants.ColorOrange, x, y);
      }
      else {
        bottom = y - 1;
        debug.setPixelColor(Constants.ColorGreen, x, y);
      }
    });

    return bottom;
  }

  private findActiveHistoryItemLeft(image: Jimp, debug: DebugImageWriter, right: number, top: number): number | undefined {
    let left: number | undefined;
    for (let x = right - 1; x >= 0; --x) {
      const index = image.getPixelIndex(x, top);

      if (this.isActiveHistoryItemAtIndex(image, index)) {
        debug.setPixelColor(Constants.ColorOrange, x, top);
      }
      else {
        left = x + 1;
        debug.setPixelColor(Constants.ColorGreen, x, top);
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

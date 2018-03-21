import * as Jimp from 'jimp';
import { IRectangle } from './rectangle';

const DIMENSION_INDEX_X = 0;
const DIMENSION_INDEX_Y = 1;

export class FindPhotoRectangleResult implements IRectangle {
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly width: number,
    public readonly height: number,
    public readonly borderLeft: number){
    }
}

enum SearchState {
  noBorderFound,
  firstBorderFound,
  withinPhoto,
}

export function findPhotoRectangle(image: Jimp): FindPhotoRectangleResult {
  const xBorders = findPhotoBorders(image, DIMENSION_INDEX_X);
  const yBorders = findPhotoBorders(image, DIMENSION_INDEX_Y);

  if (!xBorders || !yBorders) {
    return null;
  }

  return new FindPhotoRectangleResult(
    xBorders.photoStartIndex,
    yBorders.photoStartIndex,
    xBorders.photoEndIndex - xBorders.photoStartIndex,
    yBorders.photoEndIndex - yBorders.photoStartIndex,
    xBorders.borderStartIndex);
}

function findPhotoBorders(image: Jimp, dimensionIndex: number) {
  const requiredConsecutiveBorderColorCount = 10;

  let state = SearchState.noBorderFound;
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

    if (isPhotoBorderColor(red, green, blue)) {
      consecutiveBorderColorCount++;
    }
    else {
      consecutiveBorderColorCount = 0;

      switch (state) {
        case SearchState.noBorderFound:
          break;

        case SearchState.firstBorderFound:
          state = SearchState.withinPhoto;
          photoStartIndex = [x, y];
          break;

        case SearchState.withinPhoto:
          break;

        default:
          throw new Error('Unexpected state.');
      }
    }

    if (consecutiveBorderColorCount === requiredConsecutiveBorderColorCount) {
      switch (state) {
        case SearchState.noBorderFound:
          borderStartIndex = [
            (x - requiredConsecutiveBorderColorCount) + 1,
            (y - requiredConsecutiveBorderColorCount) + 1];
          state = SearchState.firstBorderFound;
          break;

        case SearchState.firstBorderFound:
          break;

        case SearchState.withinPhoto:
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
    console.log('Photo border not found.');
    return null;
  }
  else if (!photoStartIndex) {
    console.log('Photo start position not found.');
    return null;
  }
  else if (!photoEndIndex) {
    console.log('Photo end position not found.');
    return null;
  }

  return {
    photoStartIndex: photoStartIndex[dimensionIndex],
    photoEndIndex: photoEndIndex[dimensionIndex],
    borderStartIndex: borderStartIndex[dimensionIndex],
  };
}

function isPhotoBorderColor(r: number, g: number, b: number) {
  return isBorderColor(r) && isBorderColor(g) && isBorderColor(b);
}

function isBorderColor(color: number) {
  return isWindowsLightroomBorderColor(color) || isMacLightroomBorderColor(color);
}

function isWindowsLightroomBorderColor(color: number) {
  const min = 125;
  const max = 129;
  return color >= min && color <= max;
}

function isMacLightroomBorderColor(color: number) {
  const min = 135;
  const max = 150;
  return color >= min && color <= max;
}

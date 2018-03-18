const DIMENSION_INDEX_X = 0;
const DIMENSION_INDEX_Y = 1;

module.exports = function findPhotoRectangle(image) {
  const xBorders = findPhotoBorders(image, DIMENSION_INDEX_X);
  const yBorders = findPhotoBorders(image, DIMENSION_INDEX_Y);

  if (!xBorders || !yBorders) {
    return null;
  }

  return {
    left: xBorders.photoStartIndex,
    top: yBorders.photoStartIndex,
    width: xBorders.photoEndIndex - xBorders.photoStartIndex,
    height: yBorders.photoEndIndex - yBorders.photoStartIndex,
    borderLeft: xBorders.borderStartIndex,
  };
};

function findPhotoBorders(image, dimensionIndex) {
  const STATE_NO_BORDER_FOUND = 0;
  const STATE_FIRST_BORDER_FOUND = 1;
  const STATE_IN_PHOTO = 2;

  const requiredConsecutiveBorderColorCount = 10;

  let state = STATE_NO_BORDER_FOUND;
  let consecutiveBorderColorCount = 0;

  let borderStartIndex = null;
  let photoStartIndex = null;
  let photoEndIndex = null;

  const scanX = dimensionIndex === DIMENSION_INDEX_X ? 0 : image.bitmap.width / 2;
  const scanY = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.height / 2 : 0;
  const scanW = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.width : 1;
  const scanH = dimensionIndex === DIMENSION_INDEX_X ? 1 : image.bitmap.height;

  image.scan(scanX, scanY, scanW, scanH, function find(x, y, index) {
    if (photoEndIndex) {
      return;
    }

    const red = this.bitmap.data[index + 0];
    const green = this.bitmap.data[index + 1];
    const blue = this.bitmap.data[index + 2];

    if (isPhotoBorderColor(red, green, blue)) {
      consecutiveBorderColorCount++;
    }
    else {
      consecutiveBorderColorCount = 0;

      switch (state) {
        case STATE_NO_BORDER_FOUND:
          break;

        case STATE_FIRST_BORDER_FOUND:
          state = STATE_IN_PHOTO;
          photoStartIndex = [x, y];
          break;

        case STATE_IN_PHOTO:
          break;

        default:
          throw new Error('Unexpected state.');
      }
    }

    if (consecutiveBorderColorCount === requiredConsecutiveBorderColorCount) {
      switch (state) {
        case STATE_NO_BORDER_FOUND:
          borderStartIndex = [(x - requiredConsecutiveBorderColorCount) + 1, (y - requiredConsecutiveBorderColorCount) + 1];
          state = STATE_FIRST_BORDER_FOUND;
          break;

        case STATE_FIRST_BORDER_FOUND:
          break;

        case STATE_IN_PHOTO:
          photoEndIndex = [(x - requiredConsecutiveBorderColorCount) + 1, (y - requiredConsecutiveBorderColorCount) + 1];
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

function isPhotoBorderColor(r, g, b) {
  return isBorderColor(r) && isBorderColor(g) && isBorderColor(b);
}

function isBorderColor(color) {
  return isWindowsLightroomBorderColor(color) || isMacLightroomBorderColor(color);
}

function isWindowsLightroomBorderColor(color) {
  const min = 125;
  const max = 129;
  return color >= min && color <= max;
}

function isMacLightroomBorderColor(color) {
  const min = 135;
  const max = 150;
  return color >= min && color <= max;
}

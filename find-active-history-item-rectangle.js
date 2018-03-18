// We'll try and support retina/high density displays by trying larger
// offsets in sequence.
const pixelRatioMultipliers = [
  1,
  2,
  3,
];

const borderLeftIndexOffsetBase = 15;
let detectedPixelRatio = 0;

module.exports = function findActiveHistoryItemRectangle(image, borderLeftIndex) {
  if (detectedPixelRatio) {
    // console.log(`Finding history item for ${detectedPixelRatio}x pixel ratio.`);
    return findActiveHistoryItemRectangleForOffset(image, borderLeftIndex, detectedPixelRatio * borderLeftIndexOffsetBase);
  }

  for (const multiplier of pixelRatioMultipliers) {
    console.log(`Attempting to find history item for ${multiplier}x pixel ratio.`);
    const result = findActiveHistoryItemRectangleForOffset(image, borderLeftIndex, multiplier * borderLeftIndexOffsetBase);
    if (result) {
      detectedPixelRatio = multiplier;
      return result;
    }
  }

  return null;
};

function findActiveHistoryItemRectangleForOffset(image, borderLeftIndex, borderLeftIndexOffset) {
  const xSearchIndex = borderLeftIndex - borderLeftIndexOffset;

  const top = findActiveHistoryItemTop(image, xSearchIndex);
  if (!top) {
    console.log('Active history item top border not found.');
    return null;
  }

  const right = findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
  if (!right) {
    console.log('Active history item right border not found.');
    return null;
  }

  const bottom = findActiveHistoryItemBottom(image, right, top);
  if (!bottom) {
    console.log('Active history item bottom border not found.');
    return null;
  }

  const left = findActiveHistoryItemLeft(image, right, top);
  if (!left) {
    console.log('Active history item left border not found.');
    return null;
  }

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

function findActiveHistoryItemTop(image, xSearchIndex) {
  const requiredConsecutiveBorderColorCount = 10;
  let consecutiveBorderColorCount = 0;
  let top;
  image.scan(xSearchIndex, 0, 1, image.bitmap.height, function find(x, y, index) {
    if (top) {
      return;
    }

    if (isActiveHistoryItemAtIndex(this, index)) {
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

function findActiveHistoryItemRight(image, xSearchIndex, top, maximumScanLength) {
  let right;
  image.scan(xSearchIndex, top, maximumScanLength, 1, function find(x, y, index) {
    if (right) {
      return;
    }

    if (!isActiveHistoryItemAtIndex(this, index)) {
      right = x - 1;
    }
  });

  return right;
}

function findActiveHistoryItemBottom(image, right, top) {
  let bottom;
  image.scan(right, top, 1, image.bitmap.height - top, function find(x, y, index) {
    if (bottom) {
      return;
    }

    if (!isActiveHistoryItemAtIndex(this, index)) {
      bottom = y - 1;
    }
  });

  return bottom;
}

function findActiveHistoryItemLeft(image, right, top) {
  let left;
  for (let x = right - 1; x >= 0; --x) {
    const index = image.getPixelIndex(x, top);
    if (!isActiveHistoryItemAtIndex(image, index)) {
      left = x + 1;
      break;
    }
  }

  return left;
}

function isActiveHistoryItemAtIndex(image, index) {
  const red = image.bitmap.data[index + 0];
  const green = image.bitmap.data[index + 1];
  const blue = image.bitmap.data[index + 2];

  return isActiveHistoryItem(red, green, blue);
}

function isActiveHistoryItem(r, g, b) {
  return isActiveHistoryItemColor(r) && isActiveHistoryItemColor(g) && isActiveHistoryItemColor(b);
}

function isActiveHistoryItemColor(color) {
  return isWindowsLightroomActiveHistoryItemColor(color) || isMacLightroomActiveHistoryItemColor(color);
}

function isWindowsLightroomActiveHistoryItemColor(color) {
  const min = 177;
  const max = 179;
  return color >= min && color <= max;
}

function isMacLightroomActiveHistoryItemColor(color) {
  const min = 190;
  const max = 220;
  return color >= min && color <= max;
}

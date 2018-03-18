

module.exports = function findActiveHistoryItemRectangle(image, borderLeftIndex) {

  const borderLeftIndexOffset = 15;
  var xSearchIndex =  borderLeftIndex - borderLeftIndexOffset;

  var top = findActiveHistoryItemTop(image, xSearchIndex);
  if(!top){
    console.log('Active history item top border not found.');
    return null;
  }

  var right = findActiveHistoryItemRight(image, xSearchIndex, top, borderLeftIndexOffset);
  if(!right){
    console.log('Active history item right border not found.');
    return null;
  }

  var bottom = findActiveHistoryItemBottom(image, right, top);
  if(!bottom){
    console.log('Active history item bottom border not found.');
    return null;
  }

  var left = findActiveHistoryItemLeft(image, right, top);
  if(!left){
    console.log('Active history item left border not found.');
    return null;
  }

  return {
    left: left,
    top: top,
    width: right - left,
    height: bottom - top
  };
}

function findActiveHistoryItemTop(image, xSearchIndex){
  const requiredConsecutiveBorderColorCount = 10;
  var consecutiveBorderColorCount = 0;
  var top;
  image.scan(xSearchIndex, 0, 1, image.bitmap.height, function (x, y, index) {
    if(top){
      return;
    }
    
    if(isActiveHistoryItemAtIndex(this, index)){
      consecutiveBorderColorCount++;
    }
    else{
      consecutiveBorderColorCount = 0;
    }

    if(consecutiveBorderColorCount === requiredConsecutiveBorderColorCount){
      top = y - requiredConsecutiveBorderColorCount + 1;
    }
  });

  return top;
}

function findActiveHistoryItemRight(image, xSearchIndex, top, maximumScanLength){
  var right;
  image.scan(xSearchIndex, top, maximumScanLength, 1, function (x, y, index) {
    if(right){
      return;
    }

    if(!isActiveHistoryItemAtIndex(this, index)){
      right = x - 1;
    }
  });

  return right;
}

function findActiveHistoryItemBottom(image, right, top){
  var bottom;
  image.scan(right, top, 1, image.bitmap.height - top, function (x, y, index) {
    if(bottom){
      return;
    }

    if(!isActiveHistoryItemAtIndex(this, index)){
      bottom = y - 1;
    }
  });

  return bottom;
}

function findActiveHistoryItemLeft(image, right, top){
  
  var left;
  for(var x=right - 1; x >= 0; --x){
    var index = image.getPixelIndex(x, top);
    if(!isActiveHistoryItemAtIndex(image, index)){
      left = x + 1;
      break;
    }
  }

  return left;
}

function isActiveHistoryItemAtIndex(image, index){
  var red   = image.bitmap.data[ index + 0 ];
  var green = image.bitmap.data[ index + 1 ];
  var blue  = image.bitmap.data[ index + 2 ];

  return isActiveHistoryItem(red, green, blue);
}

function isActiveHistoryItem(r, g, b) {
  return isActiveHistoryItemColor(r) && isActiveHistoryItemColor(g) && isActiveHistoryItemColor(b);
}

function isActiveHistoryItemColor(color) {
  const min = 177;
  const max = 179;
  return color >= min && color <= max;
}

var jimp = require('jimp');

const DIMENSION_INDEX_X = 0;
const DIMENSION_INDEX_Y = 1;

module.exports = function findPhotoRectangle(image) {
  var xBorders = findPhotoBorders(image, DIMENSION_INDEX_X);
  var yBorders = findPhotoBorders(image, DIMENSION_INDEX_Y);

  if(!xBorders || !yBorders){
    return null;
  }

  return {
    left: xBorders.photoStartIndex,
    top: yBorders.photoStartIndex,
    width: xBorders.photoEndIndex - xBorders.photoStartIndex,
    height: yBorders.photoEndIndex - yBorders.photoStartIndex,
    borderLeft: xBorders.borderStartIndex,
  };
}

function findPhotoBorders(image, dimensionIndex){
  
  const STATE_NO_BORDER_FOUND = 0;
  const STATE_FIRST_BORDER_FOUND = 1;
  const STATE_IN_PHOTO = 2;

  const requiredConsecutiveBorderColorCount = 10;

  var state = STATE_NO_BORDER_FOUND;
  var consecutiveBorderColorCount = 0;
  
  var borderStartIndex = null;
  var photoStartIndex = null;
  var photoEndIndex = null;

  var scanX = dimensionIndex === DIMENSION_INDEX_X ? 0 : image.bitmap.width / 2;
  var scanY = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.height / 2 : 0;
  var scanW = dimensionIndex === DIMENSION_INDEX_X ? image.bitmap.width : 1;
  var scanH = dimensionIndex === DIMENSION_INDEX_X ? 1 : image.bitmap.height;
  
  image.scan(scanX, scanY, scanW, scanH, function (x, y, index) {
    if(photoEndIndex){
      return;
    }

    var red   = this.bitmap.data[ index + 0 ];
    var green = this.bitmap.data[ index + 1 ];
    var blue  = this.bitmap.data[ index + 2 ];
    
    if(isPhotoBorderColor(red, green, blue)){
      consecutiveBorderColorCount++;
    }
    else{
      consecutiveBorderColorCount = 0;
    
      switch(state){
        case STATE_NO_BORDER_FOUND:
          break;

        case STATE_FIRST_BORDER_FOUND:
          state = STATE_IN_PHOTO;
          photoStartIndex = [x, y];
          break;
  
        case STATE_IN_PHOTO: 
          break;
      }
    }

    if(consecutiveBorderColorCount === requiredConsecutiveBorderColorCount){
      switch(state){
        case STATE_NO_BORDER_FOUND:
          borderStartIndex = [x - requiredConsecutiveBorderColorCount + 1, y - requiredConsecutiveBorderColorCount + 1];
          state = STATE_FIRST_BORDER_FOUND; 
          break;

        case STATE_FIRST_BORDER_FOUND:
          break;
  
        case STATE_IN_PHOTO: 
          photoEndIndex = [x - requiredConsecutiveBorderColorCount + 1, y - requiredConsecutiveBorderColorCount + 1];
      }
    }
  });

  if(!borderStartIndex){
    console.log('Photo border not found.');
    return null;
  }
  else if(!photoStartIndex){
    console.log('Photo start position not found.');
    return null;
  }
  else if(!photoEndIndex){
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
  const min = 125;
  const max = 129;
  return color >= min && color <= max;
}

var screenshot = require('desktop-screenshot');
var jimp = require('jimp');
var fs = require('fs');
var getScreenshotAsync = require('./get-screenshot.js');
var findPhotoRectangle = require('./find-photo-rectangle.js');
var findActiveHistoryItemRectangle = require('./find-active-history-item-rectangle.js');

async function run(){
  console.log('Taking screenshot...');
  var screenshot = await getScreenshotAsync();
  
  console.log('Finding lightroom image...');
  var photoRectangle = await findPhotoRectangle(screenshot);

  if(!photoRectangle){
    console.log('Failed to find photo.');
    return;
  }

  console.log(`Found photo at ${photoRectangle.left},${photoRectangle.top} with dimensions ${photoRectangle.width}x${photoRectangle.height}.`);
  console.log(`Photo border starts at index ${photoRectangle.borderLeft}.`);

  var photo = screenshot
    .clone()
    .crop(
      photoRectangle.left, 
      photoRectangle.top, 
      photoRectangle.width, 
      photoRectangle.height);

  photo.quality(80).write('photo.jpg');

  var activeHistoryItemRectangle = findActiveHistoryItemRectangle(screenshot, photoRectangle.borderLeft);
  
  if(!activeHistoryItemRectangle){
    console.log('Failed to find active history item.');
    return;
  }

  console.log(`Found history at ${activeHistoryItemRectangle.left},${activeHistoryItemRectangle.top} with dimensions ${activeHistoryItemRectangle.width}x${activeHistoryItemRectangle.height}.`);
  
  var history = screenshot
    .clone()
    .crop(
      activeHistoryItemRectangle.left, 
      activeHistoryItemRectangle.top, 
      activeHistoryItemRectangle.width, 
      activeHistoryItemRectangle.height);

  history.quality(90).write('history.jpg');

}

run().then(
  () => console.log('Done.'),
  error => console.log(error)
);
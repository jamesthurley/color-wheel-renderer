const getScreenshotAsync = require('./get-screenshot.js');
const findPhotoRectangle = require('./find-photo-rectangle.js');
const findActiveHistoryItemRectangle = require('./find-active-history-item-rectangle.js');

module.exports = async function getSnapshot() {
  console.log('Taking screenshot...');
  const screenshot = await getScreenshotAsync();

  console.log('Finding lightroom image...');
  const photoRectangle = await findPhotoRectangle(screenshot);

  if (!photoRectangle) {
    console.log('Failed to find photo.');
    return null;
  }

  console.log(`Found photo at ${photoRectangle.left},${photoRectangle.top} with dimensions ${photoRectangle.width}x${photoRectangle.height}.`);
  console.log(`Photo border starts at index ${photoRectangle.borderLeft}.`);

  const photo = screenshot
    .clone()
    .crop(
      photoRectangle.left,
      photoRectangle.top,
      photoRectangle.width,
      photoRectangle.height,
    );

  const historyItemRectangle = findActiveHistoryItemRectangle(screenshot, photoRectangle.borderLeft);

  if (!historyItemRectangle) {
    console.log('Failed to find active history item.');
    return null;
  }

  console.log(`Found history at ${historyItemRectangle.left},${historyItemRectangle.top}`
    + ` with dimensions ${historyItemRectangle.width}x${historyItemRectangle.height}.`);

  const historyItem = screenshot
    .clone()
    .crop(
      historyItemRectangle.left,
      historyItemRectangle.top,
      historyItemRectangle.width,
      historyItemRectangle.height,
    );

  return {
    photoRectangle,
    photo,
    historyItemRectangle,
    historyItem,
  };
};

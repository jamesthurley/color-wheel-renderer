import * as Jimp from 'jimp';
import { findActiveHistoryItemRectangle } from './find-active-history-item-rectangle';
import { findPhotoRectangle, FindPhotoRectangleResult } from './find-photo-rectangle';
import { getScreenshotAsync } from './get-screenshot';
import { IRectangle } from './rectangle';
import { Snapshot } from './snapshot';

export async function getSnapshot(): Promise<Snapshot> {
  console.log('Taking screenshot...');
  const screenshot = await getScreenshotAsync();

  console.log('Finding lightroom image...');
  const photoRectangle = await findPhotoRectangle(screenshot);

  if (!photoRectangle) {
    console.log('Failed to find photo.');
    return null;
  }

  console.log(
    `Found photo at ${photoRectangle.left},${photoRectangle.top}`
    + ` with dimensions ${photoRectangle.width}x${photoRectangle.height}.`);
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

  return new Snapshot(
    photoRectangle,
    photo,
    historyItemRectangle,
    historyItem);
}

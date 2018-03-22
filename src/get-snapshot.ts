import { findActiveHistoryItemRectangle } from './find-active-history-item-rectangle';
import { findPhotoRectangle } from './find-photo-rectangle';
import { getScreenshotAsync } from './get-screenshot';
import { Snapshot } from './snapshot';
import { Log } from './log';

export async function getSnapshot(): Promise<Snapshot> {
  Log.info('Taking screenshot...');
  const screenshot = await getScreenshotAsync();

  Log.info('Finding lightroom image...');
  const photoRectangle = await findPhotoRectangle(screenshot);

  if (!photoRectangle) {
    Log.error('Failed to find photo.');
    return null;
  }

  Log.info(
    `Found photo at ${photoRectangle.left},${photoRectangle.top}`
    + ` with dimensions ${photoRectangle.width}x${photoRectangle.height}.`);
  Log.info(`Photo border starts at index ${photoRectangle.borderLeft}.`);

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
    Log.error('Failed to find active history item.');
    return null;
  }

  Log.info(`Found history at ${historyItemRectangle.left},${historyItemRectangle.top}`
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

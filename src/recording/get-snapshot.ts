import { getScreenshotAsync } from './get-screenshot';
import { Snapshot } from './snapshot';
import { Log } from '../common/log';
import { Options } from '../options';

export async function getSnapshot(): Promise<Snapshot> {
  Log.info('Taking screenshot...');
  const screenshot = await getScreenshotAsync();

  Log.info('Finding lightroom image...');
  const photoRectangle = await Options.snapshotSource.findPhotoRectangle(screenshot);

  if (!photoRectangle) {
    Log.error('Failed to find photo.');
    return null;
  }

  Log.info(
    `Found photo at ${photoRectangle.left},${photoRectangle.top}`
    + ` with dimensions ${photoRectangle.width}x${photoRectangle.height}.`);

  const photo = screenshot
    .clone()
    .crop(
      photoRectangle.left,
      photoRectangle.top,
      photoRectangle.width,
      photoRectangle.height,
    );

  const historyItemRectangle = Options.snapshotSource.findActiveHistoryItemRectangle(screenshot);

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
    screenshot,
    photoRectangle,
    photo,
    historyItemRectangle,
    historyItem);
}

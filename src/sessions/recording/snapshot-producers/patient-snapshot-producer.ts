import { ISnapshot, CachedSnapshot } from '../../pipeline/snapshot';
import { Log } from '../../../common/log';
import { IScreenshotProducer } from '../../pipeline/screenshot-producer';
import { IEditor } from '../../editors/editor';
import { getMilliseconds } from '../../../common/get-milliseconds';
import { jsonEquals } from '../../../common/json-equals';
import { ISnapshotProducer } from '../../pipeline/snapshot-producer';
import { sleep } from '../../../common/sleep';
import * as Jimp from 'jimp';
import { WithDebugImages } from '../../pipeline/with-debug-images';
import { DebugImage } from '../../pipeline/debug-image';

const WAIT_FOR_PHOTO_RENDER_MILLISECONDS = 2000;

export class PatientSnapshotProducer implements ISnapshotProducer {

  constructor(
    private readonly millisecondsBetweenScreenshots: number,
    private readonly maximumMillisecondsBetweenSnapshots: number,
    private readonly screenshotProducer: IScreenshotProducer,
    private readonly editor: IEditor) {
  }

  public async getNextSnapshot(snapshot: ISnapshot | undefined): Promise<WithDebugImages<ISnapshot | undefined>> {
    if (!snapshot) {
      return this.getSnapshot(undefined);
    }

    Log.info('Waiting for active history item to change...');

    const start = getMilliseconds();
    let ellapsed: number = 0;

    const lastActiveHistoryItemRectangle = snapshot.historyItemRectangle;
    let foundNewHistoryItem = false;
    let screenshot: Jimp | undefined;
    do {
      if (this.millisecondsBetweenScreenshots) {
        await sleep(this.millisecondsBetweenScreenshots);
        Log.info('.');
      }

      screenshot = await this.screenshotProducer.getScreenshot();
      if (!screenshot) {
        break;
      }

      const activeHistoryItemRectangleResult = this.editor.findActiveHistoryItemRectangle(screenshot);
      const activeHistoryItemRectangle = activeHistoryItemRectangleResult.value;

      ellapsed = getMilliseconds() - start;
      foundNewHistoryItem = !!activeHistoryItemRectangle
        && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
    }
    while (ellapsed < this.maximumMillisecondsBetweenSnapshots && !foundNewHistoryItem);

    if (foundNewHistoryItem) {
      if (this.millisecondsBetweenScreenshots) {
        // Pause to ensure the photo has had time to render, and take another screenshot.
        await sleep(WAIT_FOR_PHOTO_RENDER_MILLISECONDS);
        screenshot = await this.screenshotProducer.getScreenshot();
      }

      return this.getSnapshot(screenshot);
    }

    return new WithDebugImages<ISnapshot | undefined>(undefined, []);
  }

  private async getSnapshot(screenshot?: Jimp): Promise<WithDebugImages<ISnapshot | undefined>> {
    const debugImages: DebugImage[] = [];

    if (!screenshot) {
      Log.info('Taking screenshot...');
      screenshot = await this.screenshotProducer.getScreenshot();
    }

    if (!screenshot) {
      return new WithDebugImages<ISnapshot | undefined>(undefined, debugImages);
    }

    Log.info('Finding lightroom image...');
    const photoRectangleResult = await this.editor.findPhotoRectangle(screenshot);
    const photoRectangle = photoRectangleResult.value;
    debugImages.push(...photoRectangleResult.debugImages);

    if (!photoRectangle) {
      Log.error('Failed to find photo.');
      return new WithDebugImages<ISnapshot | undefined>(undefined, debugImages);
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

    const historyItemRectangleResult = this.editor.findActiveHistoryItemRectangle(screenshot);
    const historyItemRectangle = historyItemRectangleResult.value;
    debugImages.push(...historyItemRectangleResult.debugImages);

    if (!historyItemRectangle) {
      Log.error('Failed to find active history item.');
      console.log(`Found ${debugImages.length} debug images.`);
      return new WithDebugImages<ISnapshot | undefined>(undefined, debugImages);
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

    return new WithDebugImages<ISnapshot | undefined>(
      new CachedSnapshot(
        screenshot,
        photoRectangle,
        photo,
        historyItemRectangle,
        historyItem),
      debugImages);
  }
}

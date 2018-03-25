import { Snapshot } from './snapshot';
import { Log } from '../common/log';
import { IScreenshotProducer } from './screenshot-producer';
import { IEditor } from '../editors/editor';
import { getMilliseconds } from '../common/get-milliseconds';
import { jsonEquals } from '../common/json-equals';
import { ISnapshotProducer } from './snapshot-producer';

export class PatientSnapshotProducer implements ISnapshotProducer {

  constructor(
    private readonly maximumMillisecondsBetweenSnapshots: number,
    private readonly screenshotProducer: IScreenshotProducer,
    private readonly editor: IEditor){
  }

  public async getSnapshot(): Promise<Snapshot> {
    Log.info('Taking screenshot...');
    const screenshot = await this.screenshotProducer.getScreenshot();

    Log.info('Finding lightroom image...');
    const photoRectangle = await this.editor.findPhotoRectangle(screenshot);

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

    const historyItemRectangle = this.editor.findActiveHistoryItemRectangle(screenshot);

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


  public async getNextSnapshot(snapshot: Snapshot) {
    Log.info('Waiting for active history item to change...');

    const start = getMilliseconds();
    let ellapsed: number = 0;

    const lastActiveHistoryItemRectangle = snapshot.historyItemRectangle;
    let foundNewHistoryItem = false;
    do {
      Log.info('.');
      const screenshot = await this.screenshotProducer.getScreenshot();
      const activeHistoryItemRectangle = this.editor.findActiveHistoryItemRectangle(screenshot);

      ellapsed = getMilliseconds() - start;
      foundNewHistoryItem = activeHistoryItemRectangle
        && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
    }
    while (ellapsed < this.maximumMillisecondsBetweenSnapshots && !foundNewHistoryItem);

    return foundNewHistoryItem ? this.getSnapshot() : null;
  }

}

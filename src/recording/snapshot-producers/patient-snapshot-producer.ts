import { Snapshot } from '../snapshot';
import { Log } from '../../common/log';
import { IScreenshotProducer } from '../screenshot-producers/screenshot-producer';
import { IEditor } from '../../editors/editor';
import { getMilliseconds } from '../../common/get-milliseconds';
import { jsonEquals } from '../../common/json-equals';
import { ISnapshotProducer } from './snapshot-producer';
import { sleep } from '../../common/sleep';
import * as Jimp from 'jimp';

export class PatientSnapshotProducer implements ISnapshotProducer {

  constructor(
    private readonly millisecondsBetweenScreenshots: number,
    private readonly maximumMillisecondsBetweenSnapshots: number,
    private readonly screenshotProducer: IScreenshotProducer,
    private readonly editor: IEditor){
  }

  public async getNextSnapshot(snapshot: Snapshot | undefined): Promise<Snapshot | undefined> {
    if (!snapshot){
      return this.getSnapshot(undefined);
    }

    Log.info('Waiting for active history item to change...');

    const start = getMilliseconds();
    let ellapsed: number = 0;

    const lastActiveHistoryItemRectangle = snapshot.historyItemRectangle;
    let foundNewHistoryItem = false;
    let screenshot: Jimp | undefined;
    do {
      if (this.millisecondsBetweenScreenshots){
        await sleep(this.millisecondsBetweenScreenshots);
        Log.info('.');
      }

      screenshot = await this.screenshotProducer.getScreenshot();
      if (!screenshot) {
        break;
      }

      const activeHistoryItemRectangle = this.editor.findActiveHistoryItemRectangle(screenshot);

      ellapsed = getMilliseconds() - start;
      foundNewHistoryItem = !!activeHistoryItemRectangle
        && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
    }
    while (ellapsed < this.maximumMillisecondsBetweenSnapshots && !foundNewHistoryItem);

    return foundNewHistoryItem ? this.getSnapshot(screenshot) : undefined;
  }

  private async getSnapshot(screenshot?: Jimp): Promise<Snapshot | undefined> {
    if (!screenshot){
      Log.info('Taking screenshot...');
      screenshot = await this.screenshotProducer.getScreenshot();
    }

    if (!screenshot) {
      return undefined;
    }

    Log.info('Finding lightroom image...');
    const photoRectangle = await this.editor.findPhotoRectangle(screenshot);

    if (!photoRectangle) {
      Log.error('Failed to find photo.');
      return undefined;
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
      return undefined;
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
}

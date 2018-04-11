import { ISnapshotConsumer } from '../../pipeline/snapshot-consumer';
import { ISnapshot } from '../../pipeline/snapshot';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import * as Jimp from 'jimp';
import { Log } from '../../common/log';
import { Frame } from '../../pipeline/frame';
import { FrameMetadata } from '../frame-metadata';
import { FitFrameMetadataToTarget } from '../fit-frame-metadata-to-target';

export const LONG_FRAME_DELAY_CENTISECS = 200;
export const SHORT_FRAME_DELAY_CENTISECS = 50;

export class RenderingSnapshotConsumer implements ISnapshotConsumer {

  private snapshots: ISnapshot[] = [];
  private frameMetadata: FrameMetadata;

  constructor(
    private readonly frameConsumer: IFrameConsumer) {
  }

  public consume(snapshot: ISnapshot): Promise<void> {
    this.snapshots.push(snapshot);

    if (!this.frameMetadata) {
      this.frameMetadata = new FrameMetadata(
        snapshot.photoRectangle.width,
        snapshot.photoRectangle.height);
    }
    else {
      this.frameMetadata = new FrameMetadata(
        Math.max(this.frameMetadata.width, snapshot.photoRectangle.width),
        Math.max(this.frameMetadata.height, snapshot.photoRectangle.height));
    }

    return Promise.resolve();
  }

  public async complete(): Promise<void> {

    if (this.snapshots.length < 2) {
      return;
    }

    this.frameMetadata = FitFrameMetadataToTarget.execute(this.frameMetadata);

    await this.addTitleFrame();
    await this.addInitialImageFrame();

    for (const snapshot of this.snapshots.slice(1)) {
      const photo = await snapshot.loadPhoto();
      const historyItem = await snapshot.loadHistoryItem();

      const frame = this.createFrameFromPhoto(photo, this.frameMetadata);

      const overlay = historyItem;
      overlay.opacity(0.8);
      frame.composite(
        overlay,
        Math.floor(frame.bitmap.width / 2) - Math.floor(snapshot.historyItemRectangle.width / 2),
        frame.bitmap.height - snapshot.historyItemRectangle.height);

      await this.frameConsumer.consume(new Frame(frame, SHORT_FRAME_DELAY_CENTISECS));
    }

    await this.addFinalImageFrame();

    await this.frameConsumer.complete();
  }

  private async addTitleFrame(): Promise<void> {
    // For the title frame we want to show a split before/after view.
    const initialPhoto = await this.snapshots[0].loadPhoto();
    const finalPhoto = await this.snapshots[this.snapshots.length - 1].loadPhoto();

    const width = this.frameMetadata.width;
    const height = this.frameMetadata.height;
    const halfWidth = Math.floor(this.frameMetadata.width / 2);

    initialPhoto.cover(width, height);
    finalPhoto.cover(width, height);

    initialPhoto.crop(0, 0, halfWidth, height);
    finalPhoto.composite(initialPhoto, 0, 0);

    const white = Jimp.rgbaToInt(255, 255, 255, 255);
    for (let y = 0; y < height; ++y) {
      finalPhoto.setPixelColor(white, halfWidth, y);
      finalPhoto.setPixelColor(white, halfWidth + 1, y);
    }

    await this.frameConsumer.consume(new Frame(finalPhoto, LONG_FRAME_DELAY_CENTISECS));
  }

  private async addInitialImageFrame(): Promise<void> {
    // For the first frame we want to show the initial photo with no history item.
    const photo = await this.snapshots[0].loadPhoto();
    const frame = this.createFrameFromPhoto(photo, this.frameMetadata);
    await this.frameConsumer.consume(new Frame(frame, SHORT_FRAME_DELAY_CENTISECS));
  }

  private async addFinalImageFrame(): Promise<void> {
    // For the last frame we want to show the final photo with no history item.
    const photo = await this.snapshots[this.snapshots.length - 1].loadPhoto();
    const frame = this.createFrameFromPhoto(photo, this.frameMetadata);
    await this.frameConsumer.consume(new Frame(frame, LONG_FRAME_DELAY_CENTISECS));
  }

  private createFrameFromPhoto(source: Jimp, frameData: FrameMetadata): Jimp {
    const frame = source.clone();

    const initialWidth = frame.bitmap.width;
    const initialHeight = frame.bitmap.height;
    frame.scaleToFit(frameData.width, frameData.height);
    Log.verbose(`Resized photo from ${initialWidth}x${initialHeight} to ${frame.bitmap.width}x${frame.bitmap.height}.`);

    return frame;
  }
}

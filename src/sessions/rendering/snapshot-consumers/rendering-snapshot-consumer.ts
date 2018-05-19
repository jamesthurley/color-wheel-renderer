import { ISnapshotConsumer } from '../../pipeline/snapshot-consumer';
import { ISnapshot } from '../../pipeline/snapshot';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import * as Jimp from 'jimp';
import { Log } from '../../../common/log';
import { Frame } from '../../pipeline/frame';
import { FitFrameSizeToTarget } from '../fit-frame-size-to-target';
import { Size, ISize } from '../../../common/size';
import { FrameMetadata } from '../../pipeline/frame-metadata';
import { DebugImage } from '../../pipeline/debug-image';

export const LONG_FRAME_DELAY_CENTISECS = 200;
export const SHORT_FRAME_DELAY_CENTISECS = 50;

export class RenderingSnapshotConsumer implements ISnapshotConsumer {

  private snapshots: ISnapshot[] = [];
  private maxFrameSize: Size = new Size(0, 0);

  constructor(
    private readonly frameConsumer: IFrameConsumer) {
  }

  public consumeDebugImages(debugImages: ReadonlyArray<DebugImage>): Promise<void> {
    return Promise.resolve();
  }

  public consume(snapshot: ISnapshot): Promise<void> {
    this.snapshots.push(snapshot);

    if (this.snapshots.length === 1) {
      this.maxFrameSize = new Size(
        snapshot.photoRectangle.width,
        snapshot.photoRectangle.height);
    }
    else {
      this.maxFrameSize = new Size(
        Math.max(this.maxFrameSize.width, snapshot.photoRectangle.width),
        Math.max(this.maxFrameSize.height, snapshot.photoRectangle.height));
    }

    return Promise.resolve();
  }

  public async complete(): Promise<void> {

    if (this.snapshots.length < 2) {
      return;
    }

    this.maxFrameSize = FitFrameSizeToTarget.execute(this.maxFrameSize);

    await this.addTitleFrame();
    await this.addInitialImageFrame();

    for (const snapshot of this.snapshots.slice(1)) {
      const photo = await snapshot.loadPhoto();
      const historyItem = await snapshot.loadHistoryItem();

      const frame = this.createFrameFromPhoto(photo, this.maxFrameSize);

      const overlay = historyItem;
      overlay.opacity(0.8);
      frame.composite(
        overlay,
        Math.floor(frame.bitmap.width / 2) - Math.floor(snapshot.historyItemRectangle.width / 2),
        frame.bitmap.height - snapshot.historyItemRectangle.height);

      await this.frameConsumer.consume(new Frame(frame, new FrameMetadata(SHORT_FRAME_DELAY_CENTISECS)));
    }

    await this.addFinalImageFrame();

    await this.frameConsumer.complete();
  }

  private async addTitleFrame(): Promise<void> {
    // For the title frame we want to show a split before/after view.
    const initialPhoto = await this.snapshots[0].loadPhoto();
    const finalPhoto = await this.snapshots[this.snapshots.length - 1].loadPhoto();

    const width = this.maxFrameSize.width;
    const height = this.maxFrameSize.height;
    const halfWidth = Math.floor(this.maxFrameSize.width / 2);

    initialPhoto.cover(width, height);
    finalPhoto.cover(width, height);

    initialPhoto.crop(0, 0, halfWidth, height);
    finalPhoto.composite(initialPhoto, 0, 0);

    const white = Jimp.rgbaToInt(255, 255, 255, 255);
    for (let y = 0; y < height; ++y) {
      finalPhoto.setPixelColor(white, halfWidth, y);
      finalPhoto.setPixelColor(white, halfWidth + 1, y);
    }

    await this.frameConsumer.consume(new Frame(finalPhoto, new FrameMetadata(LONG_FRAME_DELAY_CENTISECS)));
  }

  private async addInitialImageFrame(): Promise<void> {
    // For the first frame we want to show the initial photo with no history item.
    const photo = await this.snapshots[0].loadPhoto();
    const frame = this.createFrameFromPhoto(photo, this.maxFrameSize);
    await this.frameConsumer.consume(new Frame(frame, new FrameMetadata(SHORT_FRAME_DELAY_CENTISECS)));
  }

  private async addFinalImageFrame(): Promise<void> {
    // For the last frame we want to show the final photo with no history item.
    const photo = await this.snapshots[this.snapshots.length - 1].loadPhoto();
    const frame = this.createFrameFromPhoto(photo, this.maxFrameSize);
    await this.frameConsumer.consume(new Frame(frame, new FrameMetadata(LONG_FRAME_DELAY_CENTISECS)));
  }

  private createFrameFromPhoto(source: Jimp, frameSize: ISize): Jimp {
    const frame = source.clone();

    const initialWidth = frame.bitmap.width;
    const initialHeight = frame.bitmap.height;
    frame.scaleToFit(frameSize.width, frameSize.height);
    Log.verbose(`Resized photo from ${initialWidth}x${initialHeight} to ${frame.bitmap.width}x${frame.bitmap.height}.`);

    return frame;
  }
}

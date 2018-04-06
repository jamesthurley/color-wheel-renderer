import { ISnapshotConsumer } from '../recording/snapshot-consumers/snapshot-consumer';
import { Snapshot } from '../recording/snapshot';
import { GifFrame, BitmapImage, GifUtil } from 'gifwrap';
import { join } from 'path';
import { Log } from '../common/log';
import { IFrameConsumer } from './frame-consumers/frame-consumer';

export const LONG_FRAME_DELAY_CENTISECS = 200;
export const SHORT_FRAME_DELAY_CENTISECS = 50;

export class PhotoOnlySnapshotConsumer implements ISnapshotConsumer {
  constructor(
    private readonly frameConsumer: IFrameConsumer) {
  }

  public consume(snapshot: Snapshot): Promise<void> {
    return this.frameConsumer.consume(snapshot.photo);
  }

  public async complete(): Promise<void> {
    return this.frameConsumer.complete();
  }
}

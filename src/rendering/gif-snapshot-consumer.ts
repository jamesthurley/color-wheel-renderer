import { ISnapshotConsumer } from '../recording/snapshot-consumers/snapshot-consumer';
import { Snapshot } from '../recording/snapshot';
import { GifFrame, BitmapImage } from 'gifwrap';

export class GifSnapshotConsumer implements ISnapshotConsumer {

  private readonly frames: GifFrame[] = [];

  public consume(snapshot: Snapshot): Promise<void> {
    const frame = new GifFrame(new BitmapImage(snapshot.photo.bitmap));
    this.frames.push(frame);
    return Promise.resolve();
  }
}

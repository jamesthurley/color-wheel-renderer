import { ISnapshotConsumer } from '../recording/snapshot-consumers/snapshot-consumer';
import { Snapshot } from '../recording/snapshot';
import { GifFrame, BitmapImage, GifUtil } from 'gifwrap';
import { join } from 'path';
import { Log } from '../common/log';

export const LONG_FRAME_DELAY_CENTISECS = 200;
export const SHORT_FRAME_DELAY_CENTISECS = 50;

export class GifSnapshotConsumer implements ISnapshotConsumer {

  private readonly frames: GifFrame[] = [];

  constructor(
    private readonly sessionFolder: string) {
  }

  public consume(snapshot: Snapshot): Promise<void> {
    const bitmapImage = new BitmapImage(snapshot.photo.bitmap);

    Log.info('Resampling photo ' + (this.frames.length + 1));
    GifUtil.quantizeDekker(bitmapImage, 256);
    const frame = new GifFrame(bitmapImage, { delayCentisecs: SHORT_FRAME_DELAY_CENTISECS });

    this.frames.push(frame);
    return Promise.resolve();
  }

  public async complete(): Promise<void> {
    if (this.frames.length) {
      this.frames[0].delayCentisecs =
        this.frames[this.frames.length - 1].delayCentisecs =
        LONG_FRAME_DELAY_CENTISECS;

      const outputFilePath = join(this.sessionFolder, 'session.gif');

      Log.info('Saving GIF...');
      await GifUtil.write(outputFilePath, this.frames);
    }
  }
}

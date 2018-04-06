import { GifFrame, BitmapImage, GifUtil } from 'gifwrap';
import { join } from 'path';
import { Log } from '../../common/log';
import { IFrameConsumer } from './frame-consumer';
import * as Jimp from 'jimp';

export const LONG_FRAME_DELAY_CENTISECS = 200;
export const SHORT_FRAME_DELAY_CENTISECS = 50;

export class GifFrameConsumer implements IFrameConsumer {

  private readonly frames: GifFrame[] = [];

  constructor(
    private readonly sessionFolder: string) {
  }

  public consume(frame: Jimp): Promise<void> {
    const bitmapImage = new BitmapImage(frame.bitmap);

    Log.info('Resampling frame ' + (this.frames.length + 1));
    GifUtil.quantizeDekker(bitmapImage, 256);

    const gifFrame = new GifFrame(bitmapImage, { delayCentisecs: SHORT_FRAME_DELAY_CENTISECS });
    this.frames.push(gifFrame);

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

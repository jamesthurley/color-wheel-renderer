import { GifFrame, BitmapImage, GifUtil } from 'gifwrap';
import { join } from 'path';
import { Log } from '../../common/log';
import { IFrameConsumer } from './frame-consumer';
import { IFrame } from '../frame';

export class GifFrameConsumer implements IFrameConsumer {

  private readonly frames: GifFrame[] = [];

  constructor(
    private readonly sessionFolder: string) {
  }

  public consume(frame: IFrame): Promise<void> {
    const bitmapImage = new BitmapImage(frame.image.bitmap);

    Log.info(`Resampling frame ${this.frames.length + 1} colors.`);
    GifUtil.quantizeDekker(bitmapImage, 256);

    const gifFrame = new GifFrame(bitmapImage, { delayCentisecs: frame.durationCentiseconds });
    this.frames.push(gifFrame);

    return Promise.resolve();
  }

  public async complete(): Promise<void> {
    if (!this.frames.length) {
      return;
    }

    Log.info('Saving GIF...');
    const outputFilePath = join(this.sessionFolder, 'session.gif');
    await GifUtil.write(outputFilePath, this.frames);
  }
}

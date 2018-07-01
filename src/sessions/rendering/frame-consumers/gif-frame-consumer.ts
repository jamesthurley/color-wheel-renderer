import { GifFrame, BitmapImage, GifUtil, Gif } from 'gifwrap';
import { join } from 'path';
import { Log } from '../../../common/log';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame } from '../../pipeline/frame';
import { GifQuantizer } from '../gif-quantizer';
import { DisplayableError } from '../../../common/displayable-error';

export class GifFrameConsumer implements IFrameConsumer {

  private readonly frames: GifFrame[] = [];

  constructor(
    private readonly quantizer: GifQuantizer,
    private readonly sessionFolder: string) {
  }

  public consume(frame: IFrame): Promise<void> {
    const bitmapImage = new BitmapImage(frame.image.bitmap);

    this.quantizeImage(bitmapImage);

    const gifFrame = new GifFrame(bitmapImage, { delayCentisecs: frame.metadata.durationCentiseconds });
    this.frames.push(gifFrame);

    return Promise.resolve();
  }

  public async complete(): Promise<void> {
    if (!this.frames.length) {
      return;
    }

    // IMGUR seems to truncate the last frame, which is meant to hold on the final image for a few seconds.
    // To work around that I'm appending an duplicate frame to the end.
    const finalFrame = this.frames[this.frames.length - 1];
    this.frames.push(new GifFrame(finalFrame.bitmap, { delayCentisecs: 1 }));

    Log.info('Saving GIF...');
    const outputFilePath = join(this.sessionFolder, 'session.gif');
    await GifUtil.write(outputFilePath, this.frames, { colorScope: Gif.LocalColorsOnly });
  }

  private quantizeImage(bitmapImage: BitmapImage) {
    Log.info(`Resampling GIF colors for frame ${this.frames.length + 1}.`);
    switch (this.quantizer) {
      case GifQuantizer.dekker:
        GifUtil.quantizeDekker(bitmapImage, 256);
        break;

      case GifQuantizer.sorokin:
        GifUtil.quantizeSorokin(bitmapImage, 256);
        break;

      case GifQuantizer.wu:
        GifUtil.quantizeWu(bitmapImage, 256);
        break;

      default:
        throw new DisplayableError('Unexpected quantizer: ' + this.quantizer);
    }
  }
}

import * as Jimp from 'jimp';
import * as fs from 'fs';
import { join } from 'path';
import { Log } from '../../../common/log';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame } from '../../pipeline/frame';
import { ffmpeg } from 'ffmpeg-stream';
import * as stream from 'stream';
import { DisplayableError } from '../../../common/displayable-error';

export class Mp4FrameConsumer implements IFrameConsumer {

  private readonly ffmpeg: any;
  private readonly input: any;

  constructor(
    private readonly framesPerSecond: number,
    private readonly sessionFolder: string) {

    if (this.framesPerSecond <= 0) {
      throw new DisplayableError('Frames per second must be greater than zero.');
    }

    this.ffmpeg = ffmpeg();
    this.input = this.ffmpeg.input({f: 'image2pipe', r: framesPerSecond});
  }

  public async consume(frame: IFrame): Promise<void> {
    const frameCount = Math.round((frame.metadata.durationCentiseconds / 100) * this.framesPerSecond);
    const buffer = await this.getImageBuffer(frame.image);

    for (let i = 0; i < frameCount; ++i) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      const ended = this.waitForStream(bufferStream);
      bufferStream.pipe(this.input, {end: false});
      await ended;
    }
  }

  public async complete(): Promise<void> {
    Log.info('Saving MP4...');

    const outputFilePath = join(this.sessionFolder, 'session.mp4');
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    this.input.end();
    this.ffmpeg.output(outputFilePath, {vcodec: 'libx264', pix_fmt: 'yuv420p', tune: 'stillimage'});
    try {
      await this.ffmpeg.run();
    }
    catch (error) {
      throw new DisplayableError('Failed to render MP4. Is FFmpeg installed and on path? Message: ' + error.message);
    }
  }

  private waitForStream(s: stream.Stream): Promise<void> {
    return new Promise((resolve) => {
      s.on('end', () => {
        resolve();
      });
    });
  }

  private async getImageBuffer(image: Jimp): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      image.getBuffer(Jimp.MIME_PNG, (error: Error, buffer: Buffer) => {
        if (error) {
          reject(error);
        }

        resolve(buffer);
      });
    });
  }
}

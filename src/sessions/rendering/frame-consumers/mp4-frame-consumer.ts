import * as Jimp from 'jimp';
import * as fs from 'fs';
import { join } from 'path';
import { Log } from '../../../common/log';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame } from '../../pipeline/frame';
import { ffmpeg } from 'ffmpeg-stream';
import * as stream from 'stream';
import { DisplayableError } from '../../../common/displayable-error';
import { sleep } from '../../../common/sleep';

const framesPerSecond: number = 25;
const transitionFrameCount: number = 5;

export class Mp4FrameConsumer implements IFrameConsumer {

  private readonly ffmpeg: any;
  private readonly input: any;
  private previousFrame: IFrame | undefined;

  constructor(
    private readonly sessionFolder: string) {

    this.ffmpeg = ffmpeg();
    this.input = this.ffmpeg.input({f: 'image2pipe', r: framesPerSecond});
  }

  public async consume(frame: IFrame): Promise<void> {
    await this.writeTransitionFrames(frame);

    const frameCount = (frame.metadata.durationCentiseconds / 100) * framesPerSecond;
    const buffer = await this.getImageBuffer(frame.image);

    for (let i = 0; i < frameCount; ++i) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      const ended = this.waitForStream(bufferStream);
      bufferStream.pipe(this.input, {end: false});
      await ended;
    }

    this.previousFrame = frame;
  }

  public async complete(): Promise<void> {
    Log.info('Saving MP4...');

    const outputFilePath = join(this.sessionFolder, 'session.mp4');
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    this.input.end();
    this.ffmpeg.output(outputFilePath, {vcodec: 'libx264', pix_fmt: 'yuv420p'});
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

  private async writeTransitionFrames(frame: IFrame): Promise<void> {
    if (this.previousFrame) {
      // Write out transition frames.
      const previousImage = this.previousFrame.image.clone();
      for (let i = 0; i < transitionFrameCount; ++i) {

        previousImage.opaque(undefined)
          .opacity(1 - ((i + 1) / transitionFrameCount));

        const newFrame = frame.image.clone();
        newFrame.composite(previousImage, 0, 0);

        const buffer = await this.getImageBuffer(newFrame);
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(this.input, {end: false});
      }
    }
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

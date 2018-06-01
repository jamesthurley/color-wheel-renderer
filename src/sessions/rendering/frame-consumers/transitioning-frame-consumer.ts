import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame, Frame } from '../../pipeline/frame';
import { DisplayableError } from '../../../common/displayable-error';
import { FrameMetadata } from '../../pipeline/frame-metadata';

export class TransitioningFrameConsumer implements IFrameConsumer {

  private previousFrame: IFrame | undefined;

  constructor(
    private readonly framesPerSecond: number,
    private readonly transitionFrames: number,
    private readonly frameConsumer: IFrameConsumer) {

    if (this.framesPerSecond <= 0) {
      throw new DisplayableError('Frames per second must be greater than zero.');
    }
  }

  public async consume(frame: IFrame): Promise<void> {
    await this.writeTransitionFrames(frame);
    await this.frameConsumer.consume(frame);
    this.previousFrame = frame;
  }

  public complete(): Promise<void> {
    return this.frameConsumer.complete();
  }

  private async writeTransitionFrames(frame: IFrame): Promise<void> {
    if (this.previousFrame && this.transitionFrames > 0) {
      const frameDurationCentiseconds = (1 / this.framesPerSecond) * 100;

      const previousImage = this.previousFrame.image.clone();
      for (let i = 0; i < this.transitionFrames; ++i) {
        previousImage.opaque(undefined)
          .opacity(1 - ((i + 1) / (this.transitionFrames + 1)));

        const newFrame = frame.image.clone();
        newFrame.composite(previousImage, 0, 0);

        await this.frameConsumer.consume(new Frame(newFrame, new FrameMetadata(frameDurationCentiseconds)));
      }
    }
  }
}

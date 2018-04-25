import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame } from '../../pipeline/frame';

export class AggregateFrameConsumer implements IFrameConsumer {

  constructor(
    private readonly frameConsumers: ReadonlyArray<IFrameConsumer>) {
  }

  public async consume(frame: IFrame): Promise<void> {
    for (const frameConsumer of this.frameConsumers) {
      await frameConsumer.consume(frame);
    }
  }

  public async complete(): Promise<void> {
    for (const frameConsumer of this.frameConsumers) {
      await frameConsumer.complete();
    }
  }
}

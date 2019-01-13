import * as Jimp from 'jimp';
import { IColorWheelConsumer } from './color-wheel-consumer';
import { IComparingConsumerHelper } from '../../color-wheels/testing/comparing-consumer-helper';

export class ComparingColorWheelConsumer implements IColorWheelConsumer {
  constructor(
    private readonly helper: IComparingConsumerHelper) {
  }

  public async consume(image: Jimp.Jimp, path: string): Promise<void> {
    this.helper.incrementConsumedCount();

    const existingImage = await Jimp.read(path);

    await this.helper.compareImage(existingImage, image, 'rendering');
  }
}

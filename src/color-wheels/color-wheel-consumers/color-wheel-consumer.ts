import * as Jimp from 'jimp';

export interface IColorWheelConsumer {
  consume(image: Jimp, path: string): Promise<void>;
}

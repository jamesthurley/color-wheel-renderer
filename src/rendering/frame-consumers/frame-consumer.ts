import * as Jimp from 'jimp';

export interface IFrameConsumer {
  consume(frame: Jimp): Promise<void>;
  complete(): Promise<void>;
}

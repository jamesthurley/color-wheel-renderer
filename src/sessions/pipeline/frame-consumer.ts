import { IFrame } from './frame';

export interface IFrameConsumer {
  consume(frame: IFrame): Promise<void>;
  complete(): Promise<void>;
}

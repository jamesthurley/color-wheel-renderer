import { ISnapshot } from './snapshot';
import { DebugImage } from './debug-image';

export interface ISnapshotConsumer {
  consumeDebugImages(debugImages: ReadonlyArray<DebugImage>): Promise<void>;
  consume(snapshot: ISnapshot): Promise<void>;
  complete(): Promise<void>;
}

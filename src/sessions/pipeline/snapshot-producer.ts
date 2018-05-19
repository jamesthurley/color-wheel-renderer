import { ISnapshot } from './snapshot';
import { WithDebugImages } from './with-debug-images';

export interface ISnapshotProducer {
  getNextSnapshot(snapshot: ISnapshot | undefined): Promise<WithDebugImages<ISnapshot | undefined>>;
}

import { ISnapshot } from '../snapshot';

export interface ISnapshotProducer {
  getNextSnapshot(snapshot: ISnapshot | undefined): Promise<ISnapshot | undefined>;
}

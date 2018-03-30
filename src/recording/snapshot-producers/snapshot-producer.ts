import { Snapshot } from '../snapshot';

export interface ISnapshotProducer {
  getNextSnapshot(snapshot: Snapshot | undefined): Promise<Snapshot | undefined>;
}

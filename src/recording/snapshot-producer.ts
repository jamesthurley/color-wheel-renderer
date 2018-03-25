import { Snapshot } from './snapshot';

export interface ISnapshotProducer {
  getSnapshot(): Promise<Snapshot | undefined>;
  getNextSnapshot(snapshot: Snapshot): Promise<Snapshot | undefined>;
}

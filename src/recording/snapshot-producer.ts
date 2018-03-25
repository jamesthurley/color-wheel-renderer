import { Snapshot } from './snapshot';

export interface ISnapshotProducer {
  getSnapshot(): Promise<Snapshot>;
  getNextSnapshot(snapshot: Snapshot): Promise<Snapshot>;
}

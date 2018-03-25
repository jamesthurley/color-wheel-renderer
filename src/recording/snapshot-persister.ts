import { Snapshot } from './snapshot';

export interface ISnapshotPersister {
  saveSnapshots(snapshots: ReadonlyArray<Snapshot>): void;
}

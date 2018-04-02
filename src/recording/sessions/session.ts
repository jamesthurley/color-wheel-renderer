import { Snapshot } from '../snapshot';

export class Session {
  constructor(
    public readonly snapshots: ReadonlyArray<Snapshot>) {
  }
}

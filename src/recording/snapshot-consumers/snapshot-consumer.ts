import { Snapshot } from '../snapshot';

export interface ISnapshotConsumer {
  consume(snapshot: Snapshot): Promise<void>;
  complete(): Promise<void>;
}

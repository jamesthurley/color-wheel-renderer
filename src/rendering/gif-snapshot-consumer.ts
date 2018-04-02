import { ISnapshotConsumer } from '../recording/snapshot-consumers/snapshot-consumer';
import { Snapshot } from '../recording/snapshot';

export class GifSnapshotConsumer implements ISnapshotConsumer {
  public consume(snapshot: Snapshot): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

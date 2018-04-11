import { ISnapshotProducer } from './snapshot-producer';
import { Log } from '../common/log';
import { ISnapshotConsumer } from './snapshot-consumer';

export interface ISessionRunner {
  run(): Promise<void>;
}

export class SessionRunner implements ISessionRunner {
  constructor(
    private readonly snapshotProducer: ISnapshotProducer,
    private readonly snapshotConsumer: ISnapshotConsumer) {
  }

  public async run(): Promise<void> {

    let snapshotCount = 0;
    let snapshot = await this.snapshotProducer.getNextSnapshot(undefined);
    while (snapshot) {
      ++snapshotCount;
      await this.snapshotConsumer.consume(snapshot);
      snapshot = await this.snapshotProducer.getNextSnapshot(snapshot);
    }

    await this.snapshotConsumer.complete();

    Log.info(`Processed ${snapshotCount} snapshots.`);
  }
}

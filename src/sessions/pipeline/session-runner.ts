import { ISnapshotProducer } from './snapshot-producer';
import { Log } from '../../common/log';
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
    let snapshotResult = await this.snapshotProducer.getNextSnapshot(undefined);
    await this.snapshotConsumer.consumeDebugImages(snapshotResult.debugImages);

    let snapshot = snapshotResult.value;
    while (snapshot) {
      ++snapshotCount;
      await this.snapshotConsumer.consume(snapshot);

      snapshotResult = await this.snapshotProducer.getNextSnapshot(snapshot);
      await this.snapshotConsumer.consumeDebugImages(snapshotResult.debugImages);
      snapshot = snapshotResult.value;
    }

    await this.snapshotConsumer.complete();

    Log.info(`Processed ${snapshotCount} snapshots.`);
  }
}

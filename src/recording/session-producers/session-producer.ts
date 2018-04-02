import { ISnapshotProducer } from '../snapshot-producers/snapshot-producer';
import { Log } from '../../common/log';
import { Snapshot } from '../snapshot';
import { Session } from './session';

export interface ISessionProducer {
  getSession(): Promise<Session>;
}

export class SessionProducer implements ISessionProducer {
  constructor(
    private readonly snapshotProducer: ISnapshotProducer) {
  }

  public async getSession(): Promise<Session> {
    const snapshots: Snapshot[] = [];

    let snapshot = await this.snapshotProducer.getNextSnapshot(undefined);
    while (snapshot) {
      snapshots.push(snapshot);
      snapshot = await this.snapshotProducer.getNextSnapshot(snapshot);
    }

    Log.info(`Found ${snapshots.length} snapshots.`);

    return new Session(snapshots);
  }
}

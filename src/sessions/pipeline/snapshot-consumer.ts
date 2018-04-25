import { ISnapshot } from './snapshot';

export interface ISnapshotConsumer {
  consume(snapshot: ISnapshot): Promise<void>;
  complete(): Promise<void>;
}

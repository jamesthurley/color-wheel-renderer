import { ISnapshot } from './snapshot';

export class Session {
  constructor(
    public readonly snapshots: ReadonlyArray<ISnapshot>) {
  }
}

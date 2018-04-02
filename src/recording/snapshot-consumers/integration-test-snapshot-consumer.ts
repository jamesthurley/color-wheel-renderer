import { ComparingSnapshotConsumer } from './comparing-snapshot-consumer';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';

export class IntegrationTestSnapshotConsumer extends ComparingSnapshotConsumer {

  private readonly writableComparisons: SnapshotComparison[] = [];

  constructor(
    sessionFolder: string,
    snapshotFolderUtilities: SnapshotFolderUtilities) {
      super(sessionFolder, snapshotFolderUtilities);
  }

  public get comparisons(): ReadonlyArray<SnapshotComparison> {
    return [...this.writableComparisons];
  }

  protected compare(expected: any, actual: any, type: string, snapshotNumber: number) {
    this.writableComparisons.push(new SnapshotComparison(
      `Snapshot ${snapshotNumber} ${type} differs.`,
      expected,
      actual));
  }
}

export class SnapshotComparison {
  constructor(
    public readonly message: string,
    public readonly expected: any,
    public readonly actual: any) {
  }
}

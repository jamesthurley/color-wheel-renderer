import { ComparingSnapshotConsumer } from './comparing-snapshot-consumer';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { jsonEquals } from '../../common/json-equals';
import { jsonStringify } from '../../common/json-stringify';
import { Log } from '../../common/log';

export class LoggingComparingSnapshotConsumer extends ComparingSnapshotConsumer {
  constructor(
    sessionFolder: string,
    snapshotFolderUtilities: SnapshotFolderUtilities) {
      super(sessionFolder, snapshotFolderUtilities);
  }

  protected compare(expected: any, actual: any, type: string, snapshotNumber: number) {
    if (!jsonEquals(expected, actual)) {

      const failureMessage = `Snapshot ${snapshotNumber} ${type} differs.
Expected:
${jsonStringify(expected)}
Actual:
${jsonStringify(actual)}`;

      Log.error(failureMessage);
    }
    else {
      Log.info(`Snapshot ${snapshotNumber} ${type} matches.`);
    }
  }
}

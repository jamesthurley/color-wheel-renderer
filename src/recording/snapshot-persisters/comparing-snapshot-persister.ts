import * as fse from 'fs-extra';
import { Snapshot } from '../snapshot';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { jsonEquals } from '../../common/json-equals';
import { Log } from '../../common/log';
import { jsonStringify } from '../../common/json-stringify';

export class ComparingSnapshotPersister {
  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public saveSnapshots(snapshots: ReadonlyArray<Snapshot>) {
    let snapshotNumber = 1;
    for (const snapshot of snapshots) {
      const inputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, snapshotNumber);

      const existingHistoryItemRectangle = fse.readJsonSync(join(inputFolder, Constants.HistoryItemMetadataFileName));
      const existingPhotoRectangle = fse.readJsonSync(join(inputFolder, Constants.PhotoMetadataFileName));

      this.compare(existingHistoryItemRectangle, snapshot.historyItemRectangle, 'history item', snapshotNumber);
      this.compare(existingPhotoRectangle, snapshot.photoRectangle, 'photo', snapshotNumber);

      ++snapshotNumber;
    }
  }

  private compare(expected: any, actual: any, type: string, snapshotNumber: number){
    if (!jsonEquals(expected, actual)){
      Log.warn(`Snapshot ${snapshotNumber} ${type} differs.`);
      Log.warn('Expected:');
      Log.warn(jsonStringify(expected));
      Log.warn('Actual:');
      Log.warn(jsonStringify(actual));
    }
  }
}

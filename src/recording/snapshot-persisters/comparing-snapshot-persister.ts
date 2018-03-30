import * as fse from 'fs-extra';
import { Snapshot } from '../snapshot';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { Rectangle } from '../../common/rectangle';

export abstract class ComparingSnapshotPersister {
  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public saveSnapshots(snapshots: ReadonlyArray<Snapshot>) {
    let snapshotNumber = 1;
    for (const snapshot of snapshots) {
      const inputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, snapshotNumber);

      const existingHistoryItemRectangle = this.loadRectangle(join(inputFolder, Constants.HistoryItemMetadataFileName));
      const existingPhotoRectangle = this.loadRectangle(join(inputFolder, Constants.PhotoMetadataFileName));

      this.compare(existingHistoryItemRectangle, snapshot.historyItemRectangle, 'history item', snapshotNumber);
      this.compare(existingPhotoRectangle, snapshot.photoRectangle, 'photo', snapshotNumber);

      ++snapshotNumber;
    }
  }

  protected abstract compare(expected: any, actual: any, type: string, snapshotNumber: number): void;

  private loadRectangle(path: string): Rectangle {
    const value = fse.readJsonSync(path);
    return new Rectangle(
      value.left,
      value.top,
      value.width,
      value.height);
  }
}

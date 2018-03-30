import * as fse from 'fs-extra';
import { Snapshot } from '../snapshot';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';

export class FilesystemSnapshotPersister {
  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public saveSnapshots(snapshots: ReadonlyArray<Snapshot>) {
    let snapshotNumber = 1;
    for (const snapshot of snapshots) {
      const outputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, snapshotNumber);

      snapshot.screenshot.write(join(outputFolder, Constants.ScreenshotFileName));
      snapshot.historyItem.write(join(outputFolder, Constants.HistoryItemFileName));
      snapshot.photo.write(join(outputFolder, Constants.PhotoFileName));

      fse.writeJsonSync(join(outputFolder, Constants.HistoryItemMetadataFileName), snapshot.historyItemRectangle);
      fse.writeJsonSync(join(outputFolder, Constants.PhotoMetadataFileName), snapshot.photoRectangle);

      ++snapshotNumber;
    }
  }
}

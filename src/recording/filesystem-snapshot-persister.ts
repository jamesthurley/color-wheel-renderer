import * as fse from 'fs-extra';
import { Snapshot } from './snapshot';
import { padStart } from '../common/pad-start';
import { normalizeFolder } from '../common/normalize-folder';

export class FilesystemSnapshotPersister {
  constructor(
    private readonly sessionFolder: string) {
  }

  public saveSnapshots(snapshots: ReadonlyArray<Snapshot>) {
    let snapshotNumber = 1;
    for (const snapshot of snapshots) {
      const snapshotFolder = 'snapshot-' + padStart(snapshotNumber, 4);
      const outputFolder = normalizeFolder(this.sessionFolder + snapshotFolder);

      snapshot.screenshot.write(outputFolder + 'screenshot.png');
      snapshot.historyItem.write(outputFolder + 'history-item.png');
      snapshot.photo.write(outputFolder + 'photo.png');

      fse.writeJsonSync(outputFolder + 'history-item.json', snapshot.historyItemRectangle);
      fse.writeJsonSync(outputFolder + 'photo.json', snapshot.photoRectangle);

      ++snapshotNumber;
    }
  }
}

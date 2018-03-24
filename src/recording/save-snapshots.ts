import * as fse from 'fs-extra';
import { Snapshot } from './snapshot';
import { Options } from '../options';
import { padStart } from '../common/pad-start';
import { normalizeFolder } from '../common/normalize-folder';

export function saveSnapshots(snapshots: ReadonlyArray<Snapshot>) {
  let snapshotNumber = 1;
  for (const snapshot of snapshots) {
    const snapshotFolder = 'snapshot-' + padStart(snapshotNumber, 4);
    const outputFolder = normalizeFolder(Options.outputFolder + snapshotFolder);

    snapshot.screenshot.write(outputFolder + 'screenshot.png');
    snapshot.historyItem.write(outputFolder + 'history-item.png');
    snapshot.photo.write(outputFolder + 'photo.png');

    fse.writeJsonSync(outputFolder + 'history-item.json', snapshot.historyItemRectangle);
    fse.writeJsonSync(outputFolder + 'photo.json', snapshot.photoRectangle);

    ++snapshotNumber;
  }
}

import * as fse from 'fs-extra';
import { Snapshot } from '../snapshot';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { ISnapshotConsumer } from './snapshot-consumer';

export class FilesystemSnapshotConsumer implements ISnapshotConsumer {

  private snapshotNumber: number = 0;

  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public consume(snapshot: Snapshot): Promise<void> {
    ++this.snapshotNumber;

    const outputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, this.snapshotNumber);

    if (snapshot.screenshot) {
      snapshot.screenshot.write(join(outputFolder, Constants.ScreenshotFileName));
    }

    snapshot.historyItem.write(join(outputFolder, Constants.HistoryItemFileName));
    snapshot.photo.write(join(outputFolder, Constants.PhotoFileName));

    fse.writeJsonSync(join(outputFolder, Constants.HistoryItemMetadataFileName), snapshot.historyItemRectangle);
    fse.writeJsonSync(join(outputFolder, Constants.PhotoMetadataFileName), snapshot.photoRectangle);

    return Promise.resolve();
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }
}

import * as fse from 'fs-extra';
import { ISnapshot } from '../../pipeline/snapshot';
import { SnapshotFolderUtilities } from '../../pipeline-common/snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { ISnapshotConsumer } from '../../pipeline/snapshot-consumer';

export class FilesystemSnapshotConsumer implements ISnapshotConsumer {

  private snapshotNumber: number = 0;

  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public async consume(snapshot: ISnapshot): Promise<void> {
    ++this.snapshotNumber;

    const outputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, this.snapshotNumber);

    const screenshot = await snapshot.loadScreenshot();
    screenshot.write(join(outputFolder, Constants.ScreenshotFileName));

    const historyItem = await snapshot.loadHistoryItem();
    historyItem.write(join(outputFolder, Constants.HistoryItemFileName));

    const photo = await snapshot.loadPhoto();
    photo.write(join(outputFolder, Constants.PhotoFileName));

    fse.writeJsonSync(join(outputFolder, Constants.HistoryItemMetadataFileName), snapshot.historyItemRectangle);
    fse.writeJsonSync(join(outputFolder, Constants.PhotoMetadataFileName), snapshot.photoRectangle);

    return Promise.resolve();
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }
}

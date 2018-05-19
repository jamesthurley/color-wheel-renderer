import * as fse from 'fs-extra';
import { ISnapshot } from '../../pipeline/snapshot';
import { SnapshotFolderUtilities } from '../../pipeline-common/snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../../common/constants';
import { ISnapshotConsumer } from '../../pipeline/snapshot-consumer';
import { DEFAULT_JSON_OPTIONS } from '../../../common/default-json-options';
import { DebugImage } from '../../pipeline/debug-image';

export class FilesystemSnapshotConsumer implements ISnapshotConsumer {

  private snapshotNumber: number = 0;

  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public async consumeDebugImages(debugImages: ReadonlyArray<DebugImage>): Promise<void> {
    ++this.snapshotNumber;

    const outputFolder = this.snapshotFolderUtilities.getFolderPath(this.sessionFolder, this.snapshotNumber);

    for (const debugImage of debugImages) {
      debugImage.image.write(join(outputFolder, debugImage.fileName));
    }
  }

  public async consume(snapshot: ISnapshot): Promise<void> {
    const outputFolder = this.snapshotFolderUtilities.getFolderPath(this.sessionFolder, this.snapshotNumber);

    const screenshot = await snapshot.loadScreenshot();
    screenshot.write(join(outputFolder, Constants.ScreenshotFileName));

    const historyItem = await snapshot.loadHistoryItem();
    historyItem.write(join(outputFolder, Constants.HistoryItemFileName));

    const photo = await snapshot.loadPhoto();
    photo.write(join(outputFolder, Constants.PhotoFileName));

    fse.writeJsonSync(join(outputFolder, Constants.HistoryItemMetadataFileName), snapshot.historyItemRectangle, DEFAULT_JSON_OPTIONS);
    fse.writeJsonSync(join(outputFolder, Constants.PhotoMetadataFileName), snapshot.photoRectangle, DEFAULT_JSON_OPTIONS);

    return Promise.resolve();
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }
}

import * as Jimp from 'jimp';
import * as fse from 'fs-extra';
import { ISnapshotProducer } from './snapshot-producer';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { Snapshot } from '../snapshot';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { SessionSnapshotFolderReader } from '../session-snapshot-folder-reader';

export class FilesystemSnapshotProducer extends SessionSnapshotFolderReader implements ISnapshotProducer {

  constructor(
    sourceFolder: string,
    snapshotFolderUtilities: SnapshotFolderUtilities,
    private readonly includeScreenshot: boolean = false) {
    super(sourceFolder, snapshotFolderUtilities);
  }

  public async getNextSnapshot(snapshot: Snapshot | undefined): Promise<Snapshot | undefined> {
    const folder = this.getNextFolder();
    if (!folder) {
      return undefined;
    }

    let screenshot: Jimp | undefined;
    if (this.includeScreenshot) {
      screenshot = await Jimp.read(join(folder, Constants.ScreenshotFileName));
    }

    const photo = await Jimp.read(join(folder, Constants.PhotoFileName));
    const historyItem = await Jimp.read(join(folder, Constants.HistoryItemFileName));

    const photoMetadata = fse.readJsonSync(join(folder, Constants.PhotoMetadataFileName));
    const historyItemMetadata = fse.readJsonSync(join(folder, Constants.HistoryItemMetadataFileName));

    return new Snapshot(screenshot, photoMetadata, photo, historyItemMetadata, historyItem);
  }
}

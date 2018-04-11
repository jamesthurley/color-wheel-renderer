import * as Jimp from 'jimp';
import { IScreenshotProducer } from '../../pipeline/screenshot-producer';
import { SnapshotFolderUtilities } from '../../pipeline-common/snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { SessionSnapshotFolderReaderBase } from '../../pipeline-common/session-snapshot-folder-reader-base';

export class FilesystemScreenshotProducer extends SessionSnapshotFolderReaderBase implements IScreenshotProducer {

  constructor(
    sourceFolder: string,
    snapshotFolderUtilities: SnapshotFolderUtilities) {
    super(sourceFolder, snapshotFolderUtilities);
  }

  public async getScreenshot(): Promise<Jimp | undefined> {
    const folder = this.getNextFolder();
    if (!folder) {
      return undefined;
    }

    return await Jimp.read(join(folder, Constants.ScreenshotFileName));
  }
}

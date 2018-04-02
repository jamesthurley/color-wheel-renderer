import * as Jimp from 'jimp';
import { IScreenshotProducer } from './screenshot-producer';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { SessionSnapshotFolderReader } from '../session-snapshot-folder-reader';

export class FilesystemScreenshotProducer extends SessionSnapshotFolderReader implements IScreenshotProducer {

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

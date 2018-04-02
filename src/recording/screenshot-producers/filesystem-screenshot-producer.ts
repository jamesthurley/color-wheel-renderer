import * as Jimp from 'jimp';
import { IScreenshotProducer } from './screenshot-producer';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';

export class FilesystemScreenshotProducer implements IScreenshotProducer {

  private folders: ReadonlyArray<string>;
  private folderIndex: number = 0;

  constructor(
    private readonly sourceFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public getScreenshot(): Promise<Jimp | undefined> {
    if (!this.folders) {
      this.folders = this.snapshotFolderUtilities.getOrderedSnapshotFolders(this.sourceFolder);
    }

    if (this.folderIndex >= this.folders.length) {
      return Promise.resolve(undefined);
    }

    const screenshotFolder = this.folders[this.folderIndex];
    ++this.folderIndex;

    return Promise.resolve(Jimp.read(join(screenshotFolder, Constants.ScreenshotFileName)));
  }
}

import * as Jimp from 'jimp';
import * as fse from 'fs-extra';
import { ISnapshotProducer } from '../../pipeline/snapshot-producer';
import { SnapshotFolderUtilities } from '../../pipeline-common/snapshot-folder-utilities';
import { ISnapshot, LazySnapshot } from '../../pipeline/snapshot';
import { join } from 'path';
import { Constants } from '../../../common/constants';
import { SessionSnapshotFolderReaderBase } from '../../pipeline-common/session-snapshot-folder-reader-base';
import { IRectangle } from '../../../common/rectangle';
import { WithDebugImages } from '../../pipeline/with-debug-images';

export class FilesystemSnapshotProducer extends SessionSnapshotFolderReaderBase implements ISnapshotProducer {

  constructor(
    sourceFolder: string,
    snapshotFolderUtilities: SnapshotFolderUtilities) {
    super(sourceFolder, snapshotFolderUtilities);
  }

  public async getNextSnapshot(snapshot: ISnapshot | undefined): Promise<WithDebugImages<ISnapshot | undefined>> {
    const folder = this.getNextFolder();
    if (!folder) {
      return new WithDebugImages<ISnapshot | undefined>(undefined, []);
    }

    const screenshot: () => Promise<Jimp> = () => Jimp.read(join(folder, Constants.ScreenshotFileName));

    const photo: () => Promise<Jimp> = () => Jimp.read(join(folder, Constants.PhotoFileName));
    const historyItem: () => Promise<Jimp> = () => Jimp.read(join(folder, Constants.HistoryItemFileName));

    const photoMetadata: IRectangle = fse.readJsonSync(join(folder, Constants.PhotoMetadataFileName));
    const historyItemMetadata: IRectangle = fse.readJsonSync(join(folder, Constants.HistoryItemMetadataFileName));

    return new WithDebugImages<ISnapshot | undefined>(
      new LazySnapshot(screenshot, photoMetadata, photo, historyItemMetadata, historyItem),
      []);
  }
}

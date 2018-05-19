import * as Jimp from 'jimp';
import * as fse from 'fs-extra';
import { ISnapshot } from '../../pipeline/snapshot';
import { SnapshotFolderUtilities } from '../../pipeline-common/snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../../common/constants';
import { Rectangle, IRectangle } from '../../../common/rectangle';
import { ISnapshotConsumer } from '../../pipeline/snapshot-consumer';
import { IComparingConsumerHelper } from '../comparing-consumer-helper';
import { DebugImage } from '../../pipeline/debug-image';

export class ComparingSnapshotConsumer implements ISnapshotConsumer {

  constructor(
    private readonly helper: IComparingConsumerHelper,
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
      this.helper.consumedType = 'Snapshot';
  }

  public consumeDebugImages(debugImages: ReadonlyArray<DebugImage>): Promise<void> {
    return Promise.resolve();
  }

  public async consume(snapshot: ISnapshot): Promise<void> {
    this.helper.incrementConsumedCount();

    const inputFolder = this.snapshotFolderUtilities.getFolderPath(this.sessionFolder, this.helper.consumedCount);

    const existingHistoryItemRectangle = this.loadRectangle(join(inputFolder, Constants.HistoryItemMetadataFileName));
    await this.helper.compareObject(existingHistoryItemRectangle, snapshot.historyItemRectangle, 'history item rectangle');

    const existingHistoryItemImage = await this.loadImage(join(inputFolder, Constants.HistoryItemFileName));
    const historyItem = await snapshot.loadHistoryItem();
    await this.helper.compareImage(existingHistoryItemImage, historyItem, 'history item');

    const existingPhotoRectangle = this.loadRectangle(join(inputFolder, Constants.PhotoMetadataFileName));
    await this.helper.compareObject(existingPhotoRectangle, snapshot.photoRectangle, 'photo rectangle');

    const existingPhoto = await this.loadImage(join(inputFolder, Constants.PhotoFileName));
    const photo = await snapshot.loadPhoto();
    await this.helper.compareImage(existingPhoto, photo, 'photo');
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }

  private loadImage(path: string): Promise<Jimp> {
    return Jimp.read(path);
  }
  private loadRectangle(path: string): Rectangle {
    const value = fse.readJsonSync(path) as IRectangle;
    return new Rectangle(
      value.left,
      value.top,
      value.width,
      value.height);
  }
}

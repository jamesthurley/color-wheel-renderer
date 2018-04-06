import * as fse from 'fs-extra';
import { Snapshot } from '../snapshot';
import { SnapshotFolderUtilities } from '../snapshot-folder-utilities';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { Rectangle } from '../../common/rectangle';
import { ISnapshotConsumer } from './snapshot-consumer';

export abstract class ComparingSnapshotConsumer implements ISnapshotConsumer {

  private snapshotNumber: number = 0;

  constructor(
    private readonly sessionFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  public consume(snapshot: Snapshot): Promise<void> {
    ++this.snapshotNumber;

    const inputFolder = this.snapshotFolderUtilities.getSnapshotFolderPath(this.sessionFolder, this.snapshotNumber);

    const existingHistoryItemRectangle = this.loadRectangle(join(inputFolder, Constants.HistoryItemMetadataFileName));
    const existingPhotoRectangle = this.loadRectangle(join(inputFolder, Constants.PhotoMetadataFileName));

    this.compare(existingHistoryItemRectangle, snapshot.historyItemRectangle, 'history item', this.snapshotNumber);
    this.compare(existingPhotoRectangle, snapshot.photoRectangle, 'photo', this.snapshotNumber);

    return Promise.resolve();
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }

  protected abstract compare(expected: any, actual: any, type: string, snapshotNumber: number): void;

  private loadRectangle(path: string): Rectangle {
    const value = fse.readJsonSync(path);
    return new Rectangle(
      value.left,
      value.top,
      value.width,
      value.height);
  }
}

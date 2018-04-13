import * as Jimp from 'jimp';
import * as fse from 'fs-extra';
import { join } from 'path';
import { Constants } from '../../common/constants';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { FrameFolderUtilities } from '../../pipeline-common/frame-folder-utilities';
import { IFrame } from '../../pipeline/frame';
import { FrameMetadata } from '../../pipeline/frame-metadata';
import { IComparingConsumerHelper } from '../comparing-consumer-helper';

export class ComparingFrameConsumer implements IFrameConsumer {

  constructor(
    private readonly helper: IComparingConsumerHelper,
    private readonly sessionFolder: string,
    private readonly frameFolderUtilities: FrameFolderUtilities) {
    this.helper.consumedType = 'Frame';
  }

  public async consume(frame: IFrame): Promise<void> {
    this.helper.incrementConsumedCount();

    const inputFolder = this.frameFolderUtilities.getFolderPath(this.sessionFolder, this.helper.consumedCount);

    const existingMetadata = this.loadFrameMetadata(inputFolder);
    const existingImage = await this.loadFrameImage(inputFolder);

    this.helper.compareObject(existingMetadata, frame.metadata, 'frame metadata');
    this.helper.compareImage(existingImage, frame.image, 'frame');
  }

  public complete(): Promise<void> {
    return Promise.resolve();
  }

  private loadFrameImage(folderPath: string): Promise<Jimp> {
    const imagePath: string = join(folderPath, Constants.FrameFileName);
    return Jimp.read(imagePath);
  }

  private loadFrameMetadata(folderPath: string): FrameMetadata {
    const metadataPath: string = join(folderPath, Constants.FrameMetadataFileName);

    const metadata = fse.readJsonSync(metadataPath) as FrameMetadata;
    return new FrameMetadata(metadata.durationCentiseconds);
  }
}

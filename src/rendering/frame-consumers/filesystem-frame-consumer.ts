import * as fse from 'fs-extra';
import { join } from 'path';
import { IFrameConsumer } from '../../pipeline/frame-consumer';
import { IFrame } from '../../pipeline/frame';
import { Constants } from '../../common/constants';
import { FrameFolderUtilities } from '../../pipeline-common/frame-folder-utilities';

export class FilesystemFrameConsumer implements IFrameConsumer {

  private frameNumber: number = 0;

  constructor(
    private readonly sessionFolder: string,
    private readonly frameFolderUtilities: FrameFolderUtilities) {
  }

  public consume(frame: IFrame): Promise<void> {
    ++this.frameNumber;

    const outputFolder = this.frameFolderUtilities.getFolderPath(this.sessionFolder, this.frameNumber);

    const frameImage = frame.image;
    const frameMetadata = {
      ...frame,
      image: undefined,
    };

    frameImage.write(join(outputFolder, Constants.FrameFileName));

    fse.writeJsonSync(join(outputFolder, Constants.FrameMetadataFileName), frameMetadata);

    return Promise.resolve();
  }

  public async complete(): Promise<void> {
    return Promise.resolve();
  }
}

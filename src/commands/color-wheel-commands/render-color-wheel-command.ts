import { ICommand } from '../command';
import { generateColorWheel } from '../../color-wheel/generate-color-wheel';

export class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly outputFile: string) {
  }

  public execute(): Promise<void> {

    const imageWidth = 1024;
    const imageHeight = 1024;

    const borderSize = 8;
    const bucketCount = 36;

    const image = generateColorWheel(imageWidth * 2, imageHeight * 2, borderSize, bucketCount);
    image.resize(imageWidth, imageHeight);
    image.write(this.outputFile);
    return Promise.resolve();
  }
}

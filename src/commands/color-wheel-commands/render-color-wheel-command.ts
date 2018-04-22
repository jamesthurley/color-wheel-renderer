import { ICommand } from '../command';
import { generateColorWheel } from '../../color-wheel/generate-color-wheel';
import { Size } from '../../common/size';

export class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly outputFile: string,
    public readonly imageSize: Size,
    public readonly borderSize: number,
    public readonly hueBuckets: number,
    public readonly saturationBuckets: number) {
  }

  public execute(): Promise<void> {
    // We generate one twice as large so that we can supersample to get nice smooth lines
    // between buckets.
    const image = generateColorWheel(
      this.imageSize.width * 2,
      this.imageSize.height * 2,
      this.borderSize,
      this.hueBuckets,
      this.saturationBuckets);

    image.resize(this.imageSize.width, this.imageSize.height);
    image.write(this.outputFile);
    return Promise.resolve();
  }
}

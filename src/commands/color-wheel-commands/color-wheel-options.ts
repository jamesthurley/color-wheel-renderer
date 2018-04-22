import { normalizeAndCreateFolderForFile } from '../../common/normalize-and-create-folder';
import { LogLevel } from '../../common/log-level';
import { Size } from '../../common/size';

export class ColorWheelOptions {
  public static default(): ColorWheelOptions {
    return new ColorWheelOptions(
      LogLevel.info,
      './color-wheel.png',
      new Size(1024, 1024),
      10,
      0,
      0);
  }

  public static create(source: ColorWheelOptions): ColorWheelOptions {
    return new ColorWheelOptions(
      source.logLevel,
      source.outputFile,
      source.imageSize,
      source.margin,
      source.hueBuckets,
      source.saturationBuckets);
  }

  constructor(
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly outputFile: string,
    public readonly imageSize: Size,
    public readonly margin: number,
    public readonly hueBuckets: number,
    public readonly saturationBuckets: number) {

    if (this.outputFile) {
      this.outputFile = normalizeAndCreateFolderForFile(this.outputFile);
    }
  }
}

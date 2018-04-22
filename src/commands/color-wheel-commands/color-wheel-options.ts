import { normalizeAndCreateFolderForFile } from '../../common/normalize-and-create-folder';
import { LogLevel } from '../../common/log-level';

export class ColorWheelOptions {
  public static default(): ColorWheelOptions {
    return new ColorWheelOptions(
      LogLevel.info,
      undefined);
  }

  public static create(source: ColorWheelOptions): ColorWheelOptions {
    return new ColorWheelOptions(
      source.logLevel,
      source.outputFile);
  }

  constructor(
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly outputFile: string | undefined) {

    if (this.outputFile) {
      this.outputFile = normalizeAndCreateFolderForFile(this.outputFile);
    }
  }
}

import { normalizeAndCreateFolderForFile } from '../../common/normalize-and-create-folder';
import { LogLevel } from '../../common/log-level';
import { ColorWheelType } from './unprocessed-color-wheel-options';

export class ColorWheelOptions {
  public static default(): ColorWheelOptions {
    return new ColorWheelOptions(
      ColorWheelType.HslFixedLightness,
      LogLevel.info,
      './color-wheel.png',
      1024,
      10,
      false,
      false,
      0,
      0,
      0,
      0,
      [1],
      [0.5],
      [1]);
  }

  public static create(source: ColorWheelOptions): ColorWheelOptions {
    return new ColorWheelOptions(
      source.type,
      source.logLevel,
      source.outputFile,
      source.diameter,
      source.margin,
      source.expand,
      source.reverseRadialColors,
      source.hueBuckets,
      source.saturationBuckets,
      source.lightnessBuckets,
      source.valueBuckets,
      source.saturation,
      source.lightness,
      source.value);
  }

  constructor(
    public readonly type: ColorWheelType,
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly outputFile: string,
    public readonly diameter: number,
    public readonly margin: number,
    public readonly expand: boolean,
    public readonly reverseRadialColors: boolean,
    public readonly hueBuckets: number,
    public readonly saturationBuckets: number,
    public readonly lightnessBuckets: number,
    public readonly valueBuckets: number,
    public readonly saturation: number[],
    public readonly lightness: number[],
    public readonly value: number[]) {

    if (this.outputFile) {
      this.outputFile = normalizeAndCreateFolderForFile(this.outputFile);
    }
  }
}

import { normalizeAndCreateFolderForFile } from '../../common/normalize-and-create-folder';
import { LogLevel } from '../../common/log-level';
import { ColorWheelType } from './color-wheel-type';

export class ColorWheelOptions {
  public static default(type: ColorWheelType): ColorWheelOptions {
    return new ColorWheelOptions(
      type,
      LogLevel.info,
      './color-wheel.png',
      980,
      10,
      false,
      false,
      false,
      0,
      0,
      type === ColorWheelType.HslFixedLightness ? [0.5] : [1]);
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
      source.reverseRadialBucketing,
      source.angularBuckets,
      source.radialBuckets,
      source.fixed);
  }

  constructor(
    public readonly type: ColorWheelType,
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly outputFile: string,
    public readonly diameter: number,
    public readonly margin: number,
    public readonly expand: boolean,
    public readonly reverseRadialColors: boolean,
    public readonly reverseRadialBucketing: boolean,
    public readonly angularBuckets: number,
    public readonly radialBuckets: number,
    public readonly fixed: number[]) {

    if (this.outputFile) {
      this.outputFile = normalizeAndCreateFolderForFile(this.outputFile);
    }
  }
}

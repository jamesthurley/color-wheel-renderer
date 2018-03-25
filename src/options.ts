import { IEditor } from './editors/editor';
import { normalizeFolder } from './common/normalize-folder';

export enum LogLevel {
  debug = 0,
  info = 1,
}

export class Options {
  constructor(
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly inputFolder: string = '.',
    public readonly outputFolder: string = '.',
    public readonly editor: IEditor,
    public readonly millisecondsBetweenScreenshots: number = 5000,
    public readonly maximumMillisecondsBetweenSnapshots: number = 30000){

    this.inputFolder = normalizeFolder(this.inputFolder);
    this.outputFolder = normalizeFolder(this.outputFolder);
  }

  public static default(): Options {
    return new Options(
      LogLevel.info,
      '.',
      '.',
      null,
      5000,
      30000);
  }

  public static create(source: Options): Options {
    return new Options(
      source.logLevel,
      source.inputFolder,
      source.outputFolder,
      source.editor,
      source.millisecondsBetweenScreenshots,
      source.maximumMillisecondsBetweenSnapshots);
  }
}

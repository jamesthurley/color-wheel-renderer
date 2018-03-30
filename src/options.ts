import { IEditor } from './editors/editor';
import { normalizeAndCreateFolder } from './common/normalize-and-create-folder';
import { isUndefined } from 'util';
import { DisplayableError } from './common/displayable-error';

export enum LogLevel {
  verbose = 0,
  info = 1,
}

export class Options {
  public static default(): Options {
    return new Options(
      LogLevel.info,
      '.',
      '.',
      undefined,
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

  constructor(
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly inputFolder: string = '.',
    public readonly outputFolder: string = '.',
    public readonly editor: IEditor | undefined,
    public readonly millisecondsBetweenScreenshots: number = 5000,
    public readonly maximumMillisecondsBetweenSnapshots: number = 30000){

    this.inputFolder = normalizeAndCreateFolder(this.inputFolder);
    this.outputFolder = normalizeAndCreateFolder(this.outputFolder);
  }

  public get definedEditor(): IEditor{
    if (isUndefined(this.editor)){
      throw new DisplayableError('Editor was not defined.');
    }
    return this.editor;
  }
}

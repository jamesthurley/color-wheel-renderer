import { IEditor } from '../../sessions/editors/editor';
import { normalizeAndCreateFolder } from '../../common/normalize-and-create-folder';
import { isUndefined } from 'util';
import { DisplayableError } from '../../common/displayable-error';
import { LogLevel } from '../../common/log-level';
import { Format } from '../../sessions/rendering/format';
import { GifQuantizer } from '../../sessions/rendering/gif-quantizer';

export const DEFAULT_TRANSITION_FRAMES = 2;

export class SessionOptions {
  public static default(): SessionOptions {
    return new SessionOptions(
      LogLevel.info,
      undefined,
      undefined,
      undefined,
      undefined,
      GifQuantizer.wu,
      DEFAULT_TRANSITION_FRAMES,
      2000,
      10000);
  }

  public static create(source: SessionOptions): SessionOptions {
    return new SessionOptions(
      source.logLevel,
      source.inputFolder,
      source.outputFolder,
      source.editor,
      source.format,
      source.gifQuantizer,
      source.transitionFrames,
      source.millisecondsBetweenScreenshots,
      source.maximumMillisecondsBetweenSnapshots);
  }

  constructor(
    public readonly logLevel: LogLevel = LogLevel.info,
    public readonly inputFolder: string | undefined,
    public readonly outputFolder: string | undefined,
    public readonly editor: IEditor | undefined,
    public readonly format: Format | undefined,
    public readonly gifQuantizer: GifQuantizer,
    public readonly transitionFrames: number,
    public readonly millisecondsBetweenScreenshots: number,
    public readonly maximumMillisecondsBetweenSnapshots: number) {

    if (this.inputFolder) {
      this.inputFolder = normalizeAndCreateFolder(this.inputFolder);
    }

    if (this.outputFolder) {
      this.outputFolder = normalizeAndCreateFolder(this.outputFolder);
    }
  }

  public get definedEditor(): IEditor {
    if (isUndefined(this.editor)) {
      throw new DisplayableError('Editor was not defined.');
    }
    return this.editor;
  }

  public get definedFormat(): Format {
    if (isUndefined(this.format)) {
      throw new DisplayableError('Format was not defined.');
    }
    return this.format;
  }
}

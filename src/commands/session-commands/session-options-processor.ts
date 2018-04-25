import { ICommandOptionsProcessor } from '../command-options-processor';
import { SessionOptions } from './session-options';
import { IUnprocessedSessionOptions } from './unprocessed-session-options';
import { EditorFactoryMap } from '../../sessions/editors/editor-factory-map';
import { Log } from '../../common/log';
import { LogLevel } from '../../common/log-level';

export class SessionOptionsProcessor implements ICommandOptionsProcessor<IUnprocessedSessionOptions, SessionOptions> {
  public process(unprocessed: IUnprocessedSessionOptions): SessionOptions | undefined {
    const options = {...SessionOptions.default()};

    if (unprocessed.verbose) {
      options.logLevel = LogLevel.verbose;
    }

    if (unprocessed.useDefaultInput) {
      options.inputFolder = '.';
    }

    if (unprocessed.useDefaultOutput) {
      options.outputFolder = '.';
    }

    if (unprocessed.input) {
      options.inputFolder = unprocessed.input;
    }

    if (unprocessed.output) {
      options.outputFolder = unprocessed.output;
    }

    const editor = unprocessed.editor;
    if (editor) {
      const factory = EditorFactoryMap.get(editor);
      if (!factory) {
        Log.error('Unknown editor: ' + editor);
        return undefined;
      }

      options.editor = factory();
    }

    Log.logLevel = options.logLevel;
    Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

    return SessionOptions.create(options);
  }
}

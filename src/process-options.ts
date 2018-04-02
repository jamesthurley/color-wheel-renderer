import { Options, LogLevel } from './options';
import { EditorFactoryMap } from './editors/editor-factory-map';
import { Log } from './common/log';

export function processOptions(editor: string | undefined, unprocessed: IUnprocessedOptions): Options | undefined {
  const options = {...Options.default()};

  if (unprocessed.useDefaultInput) {
    options.inputFolder = '.';
  }

  if (unprocessed.useDefaultOutput) {
    options.outputFolder = '.';
  }

  if (unprocessed.verbose) {
    options.logLevel = LogLevel.verbose;
  }

  if (unprocessed.input) {
    options.inputFolder = unprocessed.input;
  }

  if (unprocessed.output) {
    options.outputFolder = unprocessed.output;
  }

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

  return Options.create(options);
}

interface IUnprocessedOptions {
  input: string | undefined;
  output: string | undefined;
  verbose: boolean;
  useDefaultInput?: boolean;
  useDefaultOutput?: boolean;
}

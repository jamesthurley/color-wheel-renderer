import { Options, LogLevel } from './options';
import { normalizeAndCreateFolder } from './common/normalize-and-create-folder';
import { EditorFactoryMap } from './editors/editor-factory-map';
import { Log } from './common/log';

export function processOptions(editor: string | undefined, input: any): Options | undefined {
  const options = {...Options.default()};

  if (input.verbose) {
    options.logLevel = LogLevel.verbose;
  }
  if (input.input) {
    options.inputFolder = normalizeAndCreateFolder(input.input);
  }
  if (input.output) {
    options.outputFolder = normalizeAndCreateFolder(input.output);
  }
  else if (input.noDefaultOutput) {
    options.outputFolder = undefined;
  }

  if (options.inputFolder && !input.outputFolder){
    if (!input.noDefaultOutput) {
      options.outputFolder = options.inputFolder;
    }
  }
  else if (options.outputFolder && !input.inputFolder){
    options.inputFolder = options.outputFolder;
  }

  if (editor) {
    const factory = EditorFactoryMap.get(editor);
    if (!factory){
      Log.error('Unknown editor: ' + editor);
      return undefined;
    }

    options.editor = factory();
  }

  Log.logLevel = options.logLevel;
  Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

  return Options.create(options);
}

import { Options, LogLevel } from "./options";
import { normalizeFolder } from "./common/normalize-folder";
import { EditorFactoryMap } from "./editors/editor-factory-map";
import { Log } from "./common/log";

export function processOptions(editor: string, input: any): Options | null {
  const options = {...Options.default()};

  if (input.verbose) {
    options.logLevel = LogLevel.debug;
  }
  if (input.input) {
    options.inputFolder = normalizeFolder(input.input);
  }
  if (input.output) {
    options.outputFolder = normalizeFolder(input.output);
  }

  if (options.inputFolder && !input.outputFolder){
    options.outputFolder = options.inputFolder;
  }
  else if (options.outputFolder && !input.inputFolder){
    options.inputFolder = options.outputFolder;
  }

  if (editor) {
    const factory = EditorFactoryMap.get(editor);
    if(!factory){
      Log.error('Unknown editor: ' + editor);
      return null;
    }

    options.editor = factory();
  }

  Log.debug('Options: ' + JSON.stringify(Options, undefined, 2));

  return Options.create(options);
}

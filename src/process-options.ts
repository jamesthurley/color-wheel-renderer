import { Options, LogLevel } from "./options";
import { normalizeFolder } from "./common/normalize-folder";
import { EditorFactoryMap } from "./editors/editor-factory-map";
import { Log } from "./common/log";

export function processOptions(editor: string, input: any): boolean {
  if (input.verbose) {
    Options.logLevel = LogLevel.debug;
  }
  if (input.input) {
    Options.inputFolder = normalizeFolder(input.input);
  }
  if (input.output) {
    Options.outputFolder = normalizeFolder(input.output);
  }

  if (Options.inputFolder && !input.outputFolder){
    Options.outputFolder = Options.inputFolder;
  }
  else if (Options.outputFolder && !input.inputFolder){
    Options.inputFolder = Options.outputFolder;
  }

  if (editor) {
    const factory = EditorFactoryMap.get(editor);
    if(!factory){
      Log.error('Unknown editor: ' + editor);
      return false;
    }

    Options.editor = factory();
  }

  Log.debug('Options: ' + JSON.stringify(Options, undefined, 2));

  return true;
}

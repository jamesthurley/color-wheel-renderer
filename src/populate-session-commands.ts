import * as commander from 'commander';
import { EditorFactoryMap } from './sessions/editors/editor-factory-map';
import { IUnprocessedSessionOptions } from './commands/session-commands/unprocessed-session-options';
import { SessionOptions } from './commands/session-commands/session-options';
import { executeAction } from './execute-action';
import { SessionOptionsProcessor } from './commands/session-commands/session-options-processor';
import { RecordCommandFactory } from './commands/session-commands/record-session-command-factory';
import { verboseOption } from './verbose-option';
import { RenderCommandFactory } from './commands/session-commands/render-session-command-factory';
import { TestRecordCommandFactory } from './commands/session-commands/test-record-session-command-factory';
import { TestRenderCommandFactory } from './commands/session-commands/test-render-session-command-factory';

let editorsHelp: string = '';
for (const editorKey of EditorFactoryMap.keys()) {
  if (editorsHelp.length) {
    editorsHelp += ', ';
  }
  editorsHelp += editorKey;
}
editorsHelp = 'Editor can be one of [' + editorsHelp + '].';

export function populateSessionCommands(program: commander.CommanderStatic) {

  const record = program
    .command('record-session <editor>')
    .description(`Record a session, and keep intermediate files. ${editorsHelp}`)
    .action((editor: string, options: IUnprocessedSessionOptions) => {
      executeAction<IUnprocessedSessionOptions, SessionOptions>(
        options,
        new SessionOptionsProcessor(),
        new RecordCommandFactory());
    });
  outputOption(record);
  verboseOption(record);

  const render = program
    .command('render-session')
    .description('Render a previously recorded session to a video.')
    .action((options: IUnprocessedSessionOptions) => {
      options.useDefaultInput = true;
      executeAction<IUnprocessedSessionOptions, SessionOptions>(
        options,
        new SessionOptionsProcessor(),
        new RenderCommandFactory());
    });
  inputOption(render);
  outputOption(render);
  verboseOption(render);

  const testRecord = program
    .command('test-record-session <editor>')
    .description(`Test a previously recorded session to see if the results have changed. ${editorsHelp}`)
    .action((editor: string, options: IUnprocessedSessionOptions) => {
      options.useDefaultInput = true;
      options.editor = editor;
      executeAction<IUnprocessedSessionOptions, SessionOptions>(
        options,
        new SessionOptionsProcessor(),
        new TestRecordCommandFactory());
    });
  inputOption(testRecord);
  outputOption(testRecord);
  verboseOption(testRecord);

  const testRender = program
    .command('test-render-session')
    .description(`Test a previously rendered session to see if the results have changed.`)
    .action((options: IUnprocessedSessionOptions) => {
      options.useDefaultInput = true;
      executeAction<IUnprocessedSessionOptions, SessionOptions>(
        options,
        new SessionOptionsProcessor(),
        new TestRenderCommandFactory());
    });
  inputOption(testRender);
  outputOption(testRender);
  verboseOption(testRender);
}

function inputOption(command: commander.Command): commander.Command {
  return command.option('-i --input <folderPath>', 'Recording input folder where session should be read from.');
}

function outputOption(command: commander.Command): commander.Command {
  return command.option('-o --output <folderPath>', 'Folder where test results written to.');
}

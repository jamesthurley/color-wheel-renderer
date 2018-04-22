#!/usr/bin/env node
import * as program from 'commander';
import { Log } from './common/log';
import { processSessionOptions, IUnprocessedSessionOptions } from './process-session-options';
import { EditorFactoryMap } from './editors/editor-factory-map';
import { ICommandFactory } from './commands/command-factory';
import { RenderCommandFactory } from './commands/render-command';
import { TestRecordCommandFactory } from './commands/test-record-command';
import { RecordCommandFactory } from './commands/record-command';
import { TestRenderCommandFactory } from './commands/test-render-command';
import { RenderColorWheelCommandFactory } from './commands/render-color-wheel-command';

let editorsHelp: string = '';
for (const editorKey of EditorFactoryMap.keys()) {
  if (editorsHelp.length) {
    editorsHelp += ', ';
  }
  editorsHelp += editorKey;
}
editorsHelp = 'Editor can be one of [' + editorsHelp + '].';

program
  .version('0.1.0', '-v, --version');

const record = program
  .command('record-session <editor>')
  .description(`Record a session, and keep intermediate files. ${editorsHelp}`)
  .action((editor: string, options: IUnprocessedSessionOptions) => {
    executeAction(editor, options, new RecordCommandFactory());
  });
outputOption(record);
verboseOption(record);

const render = program
  .command('render-session')
  .description('Render a previously recorded session to a video.')
  .action((options: IUnprocessedSessionOptions) => {
    options.useDefaultInput = true;
    executeAction(undefined, options, new RenderCommandFactory());
  });
inputOption(render);
outputOption(render);
verboseOption(render);

const testRecord = program
  .command('test-record-session <editor>')
  .description(`Test a previously recorded session to see if the results have changed. ${editorsHelp}`)
  .action((editor: string, options: IUnprocessedSessionOptions) => {
    options.useDefaultInput = true;
    executeAction(editor, options, new TestRecordCommandFactory());
  });
inputOption(testRecord);
outputOption(testRecord);
verboseOption(testRecord);

const testRender = program
  .command('test-render-session')
  .description(`Test a previously rendered session to see if the results have changed.`)
  .action((options: IUnprocessedSessionOptions) => {
    options.useDefaultInput = true;
    executeAction(undefined, options, new TestRenderCommandFactory());
  });
inputOption(testRender);
outputOption(testRender);
verboseOption(testRender);

const renderColorWheel = program
  .command('render-color-wheel')
  .description('Renders a color wheel to a file.')
  .action((options: IUnprocessedSessionOptions) => {
    options.useDefaultOutput = true;
    executeAction(undefined, options, new RenderColorWheelCommandFactory());
  });
outputOption(renderColorWheel);
verboseOption(renderColorWheel);

// This removes extra arguments when debugging under e.g. VSCode.
const argv: string[] = process.argv.filter(v => v !== '--');

program.parse(argv);

function verboseOption(command: program.Command): program.Command {
  return command.option('--verbose', 'Enable verbose logging.');
}

function inputOption(command: program.Command): program.Command {
  return command.option('-i --input <path>', 'Recording input folder where session should be read from.');
}

function outputOption(command: program.Command): program.Command {
  return command.option('-o --output <path>', 'Folder where test results written to.');
}

async function executeAction(editor: string | undefined, commandLineOptions: IUnprocessedSessionOptions, commandFactory: ICommandFactory) {
  try {
    const options = processSessionOptions(editor, commandLineOptions);
    if (options) {
      const command = commandFactory.create(options);
      await command.execute();
      Log.info('Done.');
    }
  }
  catch (error) {
    if (error.isDisplayable) {
      Log.error(error.message);
    }
    else {
      Log.error('There was an unexpected error.', error);
    }
  }
}

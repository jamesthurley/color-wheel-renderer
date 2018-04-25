#!/usr/bin/env node
import * as program from 'commander';
import { Log } from './common/log';
import { EditorFactoryMap } from './sessions/editors/editor-factory-map';
import { ICommandFactory } from './commands/command-factory';
import { RenderCommandFactory } from './commands/session-commands/render-session-command-factory';
import { TestRecordCommandFactory } from './commands/session-commands/test-record-session-command-factory';
import { RecordCommandFactory } from './commands/session-commands/record-session-command-factory';
import { TestRenderCommandFactory } from './commands/session-commands/test-render-session-command-factory';
import { RenderColorWheelCommandFactory } from './commands/color-wheel-commands/render-color-wheel-command-factory';
import { ICommandOptionsProcessor } from './commands/command-options-processor';
import { SessionOptions } from './commands/session-commands/session-options';
import { IUnprocessedSessionOptions } from './commands/session-commands/unprocessed-session-options';
import { SessionOptionsProcessor } from './commands/session-commands/session-options-processor';
import { IUnprocessedColorWheelOptions } from './commands/color-wheel-commands/unprocessed-color-wheel-options';
import { ColorWheelOptions } from './commands/color-wheel-commands/color-wheel-options';
import { ColorWheelOptionsProcessor } from './commands/color-wheel-commands/color-wheel-options-processor';

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

const renderColorWheel = program
  .command('render-color-wheel')
  .description('Renders a color wheel to a file.')
  .action((options: IUnprocessedColorWheelOptions) => {
    executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
      options,
      new ColorWheelOptionsProcessor(),
      new RenderColorWheelCommandFactory());
  })
  .option('-o --output <filePath>', 'Path to file where color wheel should be saved.')
  .option('-w --width <pixels>', 'Width of output image.')
  .option('-h --height <pixels>', 'Height of output image.')
  .option('-m --margin <pixels>', 'Size of margin around color wheel.')
  .option('-b --hueBuckets <count>', 'Number of hue buckets to divide colors into. Defaults to 0, which gives a smooth output.')
  .option('-s --saturationBuckets <count>', 'Number of saturation buckets to divide colors into. Defaults to 0, which gives a smooth output.');
verboseOption(renderColorWheel);

// This removes extra arguments when debugging under e.g. VSCode.
const argv: string[] = process.argv.filter(v => v !== '--');

program.parse(argv);

function verboseOption(command: program.Command): program.Command {
  return command.option('--verbose', 'Enable verbose logging.');
}

function inputOption(command: program.Command): program.Command {
  return command.option('-i --input <folderPath>', 'Recording input folder where session should be read from.');
}

function outputOption(command: program.Command): program.Command {
  return command.option('-o --output <folderPath>', 'Folder where test results written to.');
}

async function executeAction<TUnprocessedOptions, TOptions>(
  commandLineOptions: TUnprocessedOptions,
  optionsProcessor: ICommandOptionsProcessor<TUnprocessedOptions, TOptions>,
  commandFactory: ICommandFactory<TOptions>) {
  try {
    const options = optionsProcessor.process(commandLineOptions);
    if (options) {
      const command = commandFactory.create(options);
      await command.execute();
      Log.info('Done.');
    }
  }
  catch (error) {
    if (error && error.isDisplayable) {
      Log.error(error.message);
    }
    else {
      Log.error('There was an unexpected error.', error);
    }
  }
}

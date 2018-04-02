import * as program from 'commander';
import { Log } from './common/log';
import { processOptions } from './process-options';
import { EditorFactoryMap } from './editors/editor-factory-map';
import { ICommandFactory } from './commands/command-factory';
import { RunCommandFactory } from './commands/run-command';
import { RenderCommandFactory } from './commands/render-command';
import { TestCommandFactory } from './commands/test-command';
import { RecordCommandFactory } from './commands/record-command';

let editorsHelp: string = '';
for (const editorKey in EditorFactoryMap) {
  if (!EditorFactoryMap.hasOwnProperty(editorKey)) {
    continue;
  }

  if (editorsHelp.length) {
    editorsHelp += ', ';
  }
  editorsHelp += editorKey;
}
editorsHelp = 'Editor can be one of [' + editorsHelp + '].';

program
  .version('0.1.0', '-v, --version');

const run = program
  .command('run <editor>')
  .description(`Records a session and generates a video. ${editorsHelp}`)
  .action((editor: string, options: any) => {
    executeAction(editor, options, new RunCommandFactory());
  });
outputOption(run);
verboseOption(run);

const record = program
  .command('record <editor>')
  .description(`Record a session, and keep intermediate files. ${editorsHelp}`)
  .action((editor: string, options: any) => {
    executeAction(editor, options, new RecordCommandFactory());
  });
outputOption(record);
verboseOption(record);

const render = program
  .command('render')
  .description('Render a previously recorded session to a video.')
  .action((options: any) => {
    executeAction(undefined, options, new RenderCommandFactory());
  });
inputOption(render);
outputOption(render);
verboseOption(render);

const test = program
  .command('test <editor>')
  .description(`Test a previously recorded session to see if the results have changed. ${editorsHelp}`)
  .action((editor: string, options: any) => {
    options.noDefaultOutput = true;
    executeAction(editor, options, new TestCommandFactory());
  });
inputOption(test);
outputOption(test);
verboseOption(test);

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

function executeAction(editor: string | undefined, commandLineOptions: any, commandFactory: ICommandFactory) {
  const options = processOptions(editor, commandLineOptions);
  if (options) {
    const command = commandFactory.create(options);
    command.execute().then(
      () => Log.info('Done.'),
      (error: any) => {
        if (error.isDisplayable) {
          Log.error(error.message);
        }
        else {
          Log.error('There was an unexpected error.', error);
        }
      },
    );
  }
}

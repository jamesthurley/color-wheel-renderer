import * as program from 'commander';
import { Log } from './common/log';
import { runCommand } from './commands/run-command';
import { recordCommand } from './commands/record-command';
import { testCommand } from './commands/test-command';
import { renderCommand } from './commands/render-command';
import { processOptions } from './process-options';
import { SnapshotSourceFactoryMap } from './snapshot-sources/snapshot-source-factory-map';

let editorsHelp = '';
for(let editorKey in SnapshotSourceFactoryMap){
  if(editorsHelp.length){
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
    executeAction(editor, options, runCommand);
  });
outputOption(run);
verboseOption(run);


const record = program
  .command('record <editor>')
  .description(`Record a session, and keep intermediate files. ${editorsHelp}`)
  .action((editor: string, options: any) => {
    executeAction(editor, options, recordCommand);
  });
outputOption(record);
verboseOption(record);

const render = program
  .command('render')
  .description('Render a previously recorded session to a video.')
  .action((options: any) => {
    executeAction(null, options, renderCommand);
  });
inputOption(render);
outputOption(render);
verboseOption(render);

const test = program
  .command('test <editor>')
  .description(`Test a previously recorded session to see if the results have changed. ${editorsHelp}`)
  .action((editor: string, options: any) => {
    executeAction(editor, options, testCommand);
  });
inputOption(test);
outputOption(test);
verboseOption(test);

program.parse(process.argv);

function verboseOption(command: program.Command): program.Command {
  return command.option('--verbose', 'Enable verbose logging.');
}

function inputOption(command: program.Command): program.Command {
  return command.option('-i --input <path>', 'Recording input folder where session should be read from.');
}

function outputOption(command: program.Command): program.Command {
  return command.option('-o --output <path>', 'Folder where test results written to.');
}

function executeAction(editor: string, options: any, action: () => Promise<void>) {
  if (processOptions(editor, options)) {
    action().then(
      () => Log.info('Done.'),
      (error: any) => {
        if(error.isDisplayable) {
          Log.error(error.message)
        }
        else{
          Log.error('There was an unexpected error.', error);
        }
      },
    );
  }
}

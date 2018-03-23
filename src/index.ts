import * as program from 'commander';
import { Options, LogLevel } from './options';
import { Log } from './log';
import { runCommand } from './commands/run-command';
import { recordCommand } from './commands/record-command';
import { testCommand } from './commands/test-command';
import { playCommand } from './commands/play-command';
import { createFolders } from './create-folders';

program
  .version('0.1.0', '-v, --version');

program
  .command('run [program]')
  .description('Records a session and generates a video.')
  .option('--verbose [path]', 'Enable verbose logging.')
  .option('-o --output [path]', 'Output folder.')
  .action((p, options) => {
    executeAction(options, runCommand);
  });

program
  .command('record [program]')
  .description('Record a session, and keep intermediate files.')
  .option('--verbose [path]', 'Enable verbose logging.')
  .option('-o --output [path]', 'Output folder.')
  .action((p, options) => {
    executeAction(options, recordCommand);
  });

program
  .command('test [program]')
  .description('Test a previously recorded session to see if the results have changed.')
  .option('--verbose', 'Enable verbose logging.')
  .option('-i --input [path]', 'Recording input folder where session should be read from.')
  .option('-o --output [path]', 'Folder where test results written to.')
  .action((p, options) => {
    executeAction(options, testCommand);
  });

program
  .command('play')
  .description('Play a previously recorded session and generates a video.')
  .option('--verbose', 'Enable verbose logging.')
  .option('-i --input [path]', 'Recording input folder where session should be read from.')
  .option('-o --output [path]', 'Folder where test results written to.')
  .action((options) => {
    executeAction(options, playCommand);
  });

program.parse(process.argv);

function executeAction(options: any, action: () => Promise<void>){
  handleOptions(options);
  action().then(
    () => Log.info('Done.'),
    (error) => Log.error('There was an unexpected error.', error),
  );
}

function handleOptions(options: any){
  if (options.verbose) {
    Options.logLevel = LogLevel.debug;
  }
  if (options.input) {
    Options.inputFolder = normalizeFolder(options.input);
    createFolders(Options.inputFolder);
  }
  if (options.output) {
    Options.outputFolder = normalizeFolder(options.output);
    createFolders(Options.outputFolder);
  }
}

function normalizeFolder(path: string){
  if (!path.endsWith('/') && !path.endsWith('\\')) {
    return path + '/';
  }

  return path;
}

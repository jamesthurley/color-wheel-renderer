import * as program from 'commander';
import { Options, LogLevel } from './options';
import { Log } from './log';
import { runCommand } from './commands/run-command';
import { recordCommand } from './commands/record-command';
import { testCommand } from './commands/test-command';
import { playCommand } from './commands/play-command';

program
  .version('0.1.0', '-v, --version');

program
  .command('run [program]')
  .description('Records a session and generates a video.')
  .option('--verbose', 'Enable verbose logging.')
  .action((p, options) => {
    executeAction(options, runCommand);
  });

program
  .command('record [program]')
  .description('Record a session, and keep intermediate files.')
  .option('--verbose', 'Enable verbose logging.')
  .action((p, options) => {
    executeAction(options, recordCommand);
  });

program
  .command('test [program]')
  .description('Test a previously recorded session to see if the results have changed.')
  .option('--verbose', 'Enable verbose logging.')
  .action((p, options) => {
    executeAction(options, testCommand);
  });

program
  .command('play')
  .description('Play a previously recorded session and generates a video.')
  .option('--verbose', 'Enable verbose logging.')
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
}

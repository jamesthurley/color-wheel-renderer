import * as program from 'commander';
import { Options, LogLevel } from './options';
import { getSnapshot } from './get-snapshot';
import { getNextSnapshot } from './get-next-snapshot';
import { Log } from './log';

program
  .version('0.1.0', '-v, --version');

program
  .command('run [program]')
  .description('Records a session and generates a video.')
  .action((p, options) => {
    executeAction(async () => {
      await run();
    });
  });

program
  .command('record [program]')
  .description('Record a session, and keep intermediate files.')
  .action((p, options) => {
    executeAction(async () => {
      Log.info('Record');
    });
  });

program
  .command('test [program]')
  .description('Test a previously recorded session to see if the results have changed.')
  .action((p, options) => {
    executeAction(async () => {
      Log.info('Test');
    });
  });

program
  .command('play')
  .description('Play a previously recorded session and generates a video.')
  .action((options) => {
    executeAction(async () => {
      Log.info('Play');
    });
  });

program.parse(process.argv);

function executeAction(action: () => Promise<void>){
  action().then(
    () => Log.info('Done.'),
    (error) => Log.error('There was an unexpected error.', error),
  );
}

async function run() {

  Options.logLevel = LogLevel.debug;

  const snapshots = [];

  let snapshot = await getSnapshot();
  while (snapshot) {
    snapshots.push(snapshot);
    snapshot = await getNextSnapshot(snapshot);
  }

  Log.info(`Found ${snapshots.length} snapshots.`);
}

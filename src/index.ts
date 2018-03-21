import * as program from 'commander';
import { Options, LogLevel } from './options';
import { getSnapshot } from './get-snapshot';
import { getNextSnapshot } from './get-next-snapshot';
import { Log } from './log';

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

run().then(
  () => console.log('Done.'),
  (error) => console.log(error),
);

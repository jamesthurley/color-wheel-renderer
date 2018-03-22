import { getSnapshot } from '../get-snapshot';
import { getNextSnapshot } from '../get-next-snapshot';
import { Log } from '../log';

export async function runCommand() {
  const snapshots = [];

  let snapshot = await getSnapshot();
  while (snapshot) {
    snapshots.push(snapshot);
    snapshot = await getNextSnapshot(snapshot);
  }

  Log.info(`Found ${snapshots.length} snapshots.`);
}

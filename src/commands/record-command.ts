import { Log } from '../common/log';
import { Snapshot } from '../recording/snapshot';
import { getSnapshot } from '../recording/get-snapshot';
import { getNextSnapshot } from '../recording/get-next-snapshot';
import { saveSnapshots } from '../recording/save-snapshots';

export async function recordCommand() {
  const snapshots: Snapshot[] = [];

  let snapshot = await getSnapshot();
  while (snapshot) {
    snapshots.push(snapshot);
    snapshot = await getNextSnapshot(snapshot);
  }

  Log.info(`Found ${snapshots.length} snapshots.`);

  saveSnapshots(snapshots);
}

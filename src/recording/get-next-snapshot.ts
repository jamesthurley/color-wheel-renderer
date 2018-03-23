import { findActiveHistoryItemRectangle } from './find-active-history-item-rectangle';
import { getScreenshotAsync } from './get-screenshot';
import { getSnapshot } from './get-snapshot';
import { jsonEquals } from '../json-equals';
import { sleep } from '../sleep';
import { Snapshot } from './snapshot';
import { Log } from '../log';

const millisecondsBetweenChecks = 5000;
const maximumMillisecondsBeforeContinue = 30000;

export async function getNextSnapshot(snapshot: Snapshot) {
  Log.info('Waiting for active history item to change...');

  let currentMilliseconds = 0;

  const lastActiveHistoryItemRectangle = snapshot.historyItemRectangle;
  let foundNewHistoryItem = false;
  do {
    await sleep(millisecondsBetweenChecks);
    currentMilliseconds += millisecondsBetweenChecks;

    Log.info('.');
    const screenshot = await getScreenshotAsync();
    const activeHistoryItemRectangle = findActiveHistoryItemRectangle(screenshot, snapshot.photoRectangle.borderLeft);

    foundNewHistoryItem = activeHistoryItemRectangle
      && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
  }
  while (currentMilliseconds < maximumMillisecondsBeforeContinue && !foundNewHistoryItem);

  return foundNewHistoryItem ? getSnapshot() : null;
}

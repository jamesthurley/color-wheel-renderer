import { getScreenshotAsync } from './get-screenshot';
import { getSnapshot } from './get-snapshot';
import { jsonEquals } from '../common/json-equals';
import { sleep } from '../common/sleep';
import { Snapshot } from './snapshot';
import { Log } from '../common/log';
import { Options } from '../options';

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
    const activeHistoryItemRectangle = Options.editor.findActiveHistoryItemRectangle(screenshot);

    foundNewHistoryItem = activeHistoryItemRectangle
      && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
  }
  while (currentMilliseconds < maximumMillisecondsBeforeContinue && !foundNewHistoryItem);

  return foundNewHistoryItem ? getSnapshot() : null;
}

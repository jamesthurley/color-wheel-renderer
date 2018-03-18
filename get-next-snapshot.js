const getScreenshotAsync = require('./get-screenshot.js');
const sleep = require('./sleep.js');
const jsonEquals = require('./json-equals.js');
const findActiveHistoryItemRectangle = require('./find-active-history-item-rectangle.js');
const getSnapshot = require('./get-snapshot.js');

const millisecondsBetweenChecks = 5000;
const maximumMillisecondsBeforeContinue = 30000;

module.exports = async function getNextSnapshot(snapshot) {
  console.log('Waiting for active history item to change...');

  let currentMilliseconds = 0;

  const lastActiveHistoryItemRectangle = snapshot.historyItemRectangle;
  let foundNewHistoryItem = false;
  do {
    await sleep(millisecondsBetweenChecks);
    currentMilliseconds += millisecondsBetweenChecks;

    console.log('.');
    const screenshot = await getScreenshotAsync();
    const activeHistoryItemRectangle = findActiveHistoryItemRectangle(screenshot, snapshot.photoRectangle.borderLeft);

    foundNewHistoryItem = activeHistoryItemRectangle && !jsonEquals(activeHistoryItemRectangle, lastActiveHistoryItemRectangle);
  }
  while (currentMilliseconds < maximumMillisecondsBeforeContinue && !foundNewHistoryItem);

  return foundNewHistoryItem ? getSnapshot() : null;
};

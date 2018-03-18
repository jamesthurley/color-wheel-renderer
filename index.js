const getSnapshot = require('./get-snapshot.js');
const getNextSnapshot = require('./get-next-snapshot.js');

async function run() {
  const snapshots = [];

  console.log(global.devicePixelRatio);
  let snapshot = await getSnapshot();
  while (snapshot) {
    snapshots.push(snapshot);
    snapshot = await getNextSnapshot(snapshot);
  }

  console.log(`Found ${snapshots.length} snapshots.`);
}

run().then(
  () => console.log('Done.'),
  error => console.log(error),
);

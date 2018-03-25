import { Log } from '../common/log';
import { Snapshot } from '../recording/snapshot';
import { Options } from '../options';
import { DelayedLiveScreenshotProducer } from '../recording/delayed-live-screenshot-producer';
import { LiveScreenshotProducer } from '../recording/live-screenshot-producer';
import { PatientSnapshotProducer } from '../recording/patient-snapshot-producer';
import { ISnapshotProducer } from '../recording/snapshot-producer';
import { ISnapshotPersister } from '../recording/snapshot-persister';
import { FilesystemSnapshotPersister } from '../recording/filesystem-snapshot-persister';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';

export class RecordCommandFactory implements ICommandFactory {
  create(options: Options): ICommand {

    const snapshotProducer: ISnapshotProducer = new PatientSnapshotProducer(
      options.maximumMillisecondsBetweenSnapshots,
      new DelayedLiveScreenshotProducer(
        options.millisecondsBetweenScreenshots,
        new LiveScreenshotProducer()),
      options.definedEditor);

    const snapshotPersister: ISnapshotPersister = new FilesystemSnapshotPersister(
      options.outputFolder);

    return new RecordCommand(snapshotProducer, snapshotPersister);
  }
}

export class RecordCommand implements ICommand {
  constructor(
    private readonly snapshotProducer: ISnapshotProducer,
    private readonly snapshotPersister: ISnapshotPersister) {
  }

  public async execute(): Promise<void> {

    const snapshots: Snapshot[] = [];

    let snapshot = await this.snapshotProducer.getSnapshot();
    while (snapshot) {
      snapshots.push(snapshot);
      snapshot = await this.snapshotProducer.getNextSnapshot(snapshot);
    }

    Log.info(`Found ${snapshots.length} snapshots.`);

    this.snapshotPersister.saveSnapshots(snapshots);
  }
}

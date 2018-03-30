import { Log } from '../common/log';
import { Snapshot } from '../recording/snapshot';
import { Options } from '../options';
import { LiveScreenshotProducer } from '../recording/screenshot-producers/live-screenshot-producer';
import { PatientSnapshotProducer } from '../recording/snapshot-producers/patient-snapshot-producer';
import { ISnapshotProducer } from '../recording/snapshot-producers/snapshot-producer';
import { ISnapshotPersister } from '../recording/snapshot-persisters/snapshot-persister';
import { FilesystemSnapshotPersister } from '../recording/snapshot-persisters/filesystem-snapshot-persister';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { SnapshotFolderUtilities } from '../recording/snapshot-folder-utilities';

export class RecordCommandFactory implements ICommandFactory {
  create(options: Options): ICommand {

    const snapshotProducer: ISnapshotProducer = new PatientSnapshotProducer(
      options.millisecondsBetweenScreenshots,
      options.maximumMillisecondsBetweenSnapshots,
      new LiveScreenshotProducer(),
      options.definedEditor);

    const snapshotPersister: ISnapshotPersister = new FilesystemSnapshotPersister(
      options.outputFolder,
      new SnapshotFolderUtilities());

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

    let snapshot = await this.snapshotProducer.getNextSnapshot(undefined);
    while (snapshot) {
      snapshots.push(snapshot);
      snapshot = await this.snapshotProducer.getNextSnapshot(snapshot);
    }

    Log.info(`Found ${snapshots.length} snapshots.`);

    this.snapshotPersister.saveSnapshots(snapshots);
  }
}

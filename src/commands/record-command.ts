import { Options } from '../options';
import { LiveScreenshotProducer } from '../recording/screenshot-producers/live-screenshot-producer';
import { PatientSnapshotProducer } from '../recording/snapshot-producers/patient-snapshot-producer';
import { ISnapshotProducer } from '../recording/snapshot-producers/snapshot-producer';
import { ISnapshotPersister } from '../recording/snapshot-persisters/snapshot-persister';
import { FilesystemSnapshotPersister } from '../recording/snapshot-persisters/filesystem-snapshot-persister';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { SnapshotFolderUtilities } from '../recording/snapshot-folder-utilities';
import { DisplayableError } from '../common/displayable-error';
import { ISessionProducer, SessionProducer } from '../recording/session-producers/session-producer';

export class RecordCommandFactory implements ICommandFactory {
  public create(options: Options): ICommand {

    const snapshotProducer: ISnapshotProducer = new PatientSnapshotProducer(
      options.millisecondsBetweenScreenshots,
      options.maximumMillisecondsBetweenSnapshots,
      new LiveScreenshotProducer(),
      options.definedEditor);

    const sessionProducer: ISessionProducer = new SessionProducer(
      snapshotProducer);

    if (!options.outputFolder) {
      throw new DisplayableError('Output folder must be provided.');
    }

    const snapshotPersister: ISnapshotPersister = new FilesystemSnapshotPersister(
      options.outputFolder,
      new SnapshotFolderUtilities());

    return new RecordCommand(sessionProducer, snapshotPersister);
  }
}

export class RecordCommand implements ICommand {
  constructor(
    private readonly sessionProducer: ISessionProducer,
    private readonly snapshotPersister: ISnapshotPersister) {
  }

  public async execute(): Promise<void> {
    const session = await this.sessionProducer.getSession();
    this.snapshotPersister.saveSnapshots(session.snapshots);
  }
}

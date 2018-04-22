import { SessionOptions } from '../session-options';
import { LiveScreenshotProducer } from '../recording/screenshot-producers/live-screenshot-producer';
import { PatientSnapshotProducer } from '../recording/snapshot-producers/patient-snapshot-producer';
import { ISnapshotProducer } from '../pipeline/snapshot-producer';
import { ISnapshotConsumer } from '../pipeline/snapshot-consumer';
import { FilesystemSnapshotConsumer } from '../recording/snapshot-consumers/filesystem-snapshot-consumer';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { SnapshotFolderUtilities } from '../pipeline-common/snapshot-folder-utilities';
import { DisplayableError } from '../common/displayable-error';
import { SessionRunner } from '../pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';

export class RecordCommandFactory implements ICommandFactory {
  public create(options: SessionOptions): ICommand {

    const snapshotProducer: ISnapshotProducer = new PatientSnapshotProducer(
      options.millisecondsBetweenScreenshots,
      options.maximumMillisecondsBetweenSnapshots,
      new LiveScreenshotProducer(),
      options.definedEditor);

    if (!options.outputFolder) {
      throw new DisplayableError('Output folder must be provided.');
    }

    const snapshotConsumer: ISnapshotConsumer = new FilesystemSnapshotConsumer(
      options.outputFolder,
      new SnapshotFolderUtilities());

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

import { SessionOptions } from './session-options';
import { LiveScreenshotProducer } from '../../sessions/recording/screenshot-producers/live-screenshot-producer';
import { PatientSnapshotProducer } from '../../sessions/recording/snapshot-producers/patient-snapshot-producer';
import { ISnapshotProducer } from '../../sessions/pipeline/snapshot-producer';
import { ISnapshotConsumer } from '../../sessions/pipeline/snapshot-consumer';
import { FilesystemSnapshotConsumer } from '../../sessions/recording/snapshot-consumers/filesystem-snapshot-consumer';
import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { SnapshotFolderUtilities } from '../../sessions/pipeline-common/snapshot-folder-utilities';
import { DisplayableError } from '../../common/displayable-error';
import { SessionRunner } from '../../sessions/pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';

export class RecordCommandFactory implements ICommandFactory<SessionOptions> {
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

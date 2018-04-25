import { SessionOptions } from './session-options';
import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ISnapshotProducer } from '../../sessions/pipeline/snapshot-producer';
import { FilesystemScreenshotProducer } from '../../sessions/testing/screenshot-producers/filesystem-screenshot-producer';
import { ImpatientSnapshotProducer } from '../../sessions/testing/snapshot-producers/impatient-snapshot-producer';
import { SnapshotFolderUtilities } from '../../sessions/pipeline-common/snapshot-folder-utilities';
import { Log } from '../../common/log';
import { DisplayableError } from '../../common/displayable-error';
import { ISnapshotConsumer } from '../../sessions/pipeline/snapshot-consumer';
import { FilesystemSnapshotConsumer } from '../../sessions/recording/snapshot-consumers/filesystem-snapshot-consumer';
import { SessionRunner } from '../../sessions/pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { ComparingSnapshotConsumer } from '../../sessions/testing/snapshot-consumers/comparing-snapshot-consumer';
import { LoggingConsumerHelper } from '../../sessions/testing/logging-consumer-helper';

export class TestRecordCommandFactory implements ICommandFactory<SessionOptions> {
  public create(options: SessionOptions): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const snapshotProducer: ISnapshotProducer = new ImpatientSnapshotProducer(
      new FilesystemScreenshotProducer(
        options.inputFolder,
        new SnapshotFolderUtilities()),
      options.definedEditor);

    Log.verbose(options.outputFolder ? 'Writing new results to: ' + options.outputFolder : 'Comparing to results in: ' + options.inputFolder);

    const snapshotConsumer: ISnapshotConsumer = options.outputFolder
      ? new FilesystemSnapshotConsumer(
          options.outputFolder,
          new SnapshotFolderUtilities())
      : new ComparingSnapshotConsumer(
          new LoggingConsumerHelper(),
          options.inputFolder,
          new SnapshotFolderUtilities());

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

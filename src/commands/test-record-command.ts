import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { ISnapshotProducer } from '../pipeline/snapshot-producer';
import { FilesystemScreenshotProducer } from '../testing/screenshot-producers/filesystem-screenshot-producer';
import { ImpatientSnapshotProducer } from '../testing/snapshot-producers/impatient-snapshot-producer';
import { SnapshotFolderUtilities } from '../pipeline-common/snapshot-folder-utilities';
import { Log } from '../common/log';
import { DisplayableError } from '../common/displayable-error';
import { ISnapshotConsumer } from '../pipeline/snapshot-consumer';
import { FilesystemSnapshotConsumer } from '../recording/snapshot-consumers/filesystem-snapshot-consumer';
import { SessionRunner } from '../pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { ComparingSnapshotConsumer } from '../testing/snapshot-consumers/comparing-snapshot-consumer';
import { LoggingConsumerHelper } from '../testing/logging-consumer-helper';

export class TestRecordCommandFactory implements ICommandFactory {
  public create(options: Options): ICommand {

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

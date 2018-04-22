import { SessionOptions } from '../session-options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { ISnapshotProducer } from '../pipeline/snapshot-producer';
import { SnapshotFolderUtilities } from '../pipeline-common/snapshot-folder-utilities';
import { DisplayableError } from '../common/displayable-error';
import { ISnapshotConsumer } from '../pipeline/snapshot-consumer';
import { SessionRunner } from '../pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { LoggingConsumerHelper } from '../testing/logging-consumer-helper';
import { FilesystemSnapshotProducer } from '../rendering/snapshot-producers/filesystem-snapshot-producer';
import { RenderingSnapshotConsumer } from '../rendering/snapshot-consumers/rendering-snapshot-consumer';
import { ComparingFrameConsumer } from '../testing/frame-consumers/comparing-frame-consumer';
import { FrameFolderUtilities } from '../pipeline-common/frame-folder-utilities';
import { FilesystemFrameConsumer } from '../rendering/frame-consumers/filesystem-frame-consumer';
import { Log } from '../common/log';

export class TestRenderCommandFactory implements ICommandFactory {
  public create(options: SessionOptions): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const snapshotProducer: ISnapshotProducer = new FilesystemSnapshotProducer(
      options.inputFolder,
      new SnapshotFolderUtilities());

    Log.verbose(options.outputFolder ? 'Writing new results to: ' + options.outputFolder : 'Comparing to results in: ' + options.inputFolder);

    const snapshotConsumer: ISnapshotConsumer = new RenderingSnapshotConsumer(
      options.outputFolder
        ? new FilesystemFrameConsumer(
            options.outputFolder,
            new FrameFolderUtilities())
        : new ComparingFrameConsumer(
            new LoggingConsumerHelper(),
            options.inputFolder,
            new FrameFolderUtilities()));

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

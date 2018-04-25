import { SessionOptions } from './session-options';
import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ISnapshotProducer } from '../../sessions/pipeline/snapshot-producer';
import { SnapshotFolderUtilities } from '../../sessions/pipeline-common/snapshot-folder-utilities';
import { DisplayableError } from '../../common/displayable-error';
import { ISnapshotConsumer } from '../../sessions/pipeline/snapshot-consumer';
import { SessionRunner } from '../../sessions/pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { LoggingConsumerHelper } from '../../sessions/testing/logging-consumer-helper';
import { FilesystemSnapshotProducer } from '../../sessions/rendering/snapshot-producers/filesystem-snapshot-producer';
import { RenderingSnapshotConsumer } from '../../sessions/rendering/snapshot-consumers/rendering-snapshot-consumer';
import { ComparingFrameConsumer } from '../../sessions/testing/frame-consumers/comparing-frame-consumer';
import { FrameFolderUtilities } from '../../sessions/pipeline-common/frame-folder-utilities';
import { FilesystemFrameConsumer } from '../../sessions/rendering/frame-consumers/filesystem-frame-consumer';
import { Log } from '../../common/log';

export class TestRenderCommandFactory implements ICommandFactory<SessionOptions> {
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

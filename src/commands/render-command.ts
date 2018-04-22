import { SessionOptions } from '../session-options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { DisplayableError } from '../common/displayable-error';
import { SnapshotFolderUtilities } from '../pipeline-common/snapshot-folder-utilities';
import { FilesystemSnapshotProducer } from '../rendering/snapshot-producers/filesystem-snapshot-producer';
import { ISnapshotProducer } from '../pipeline/snapshot-producer';
import { SessionRunner } from '../pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { ISnapshotConsumer } from '../pipeline/snapshot-consumer';
import { RenderingSnapshotConsumer } from '../rendering/snapshot-consumers/rendering-snapshot-consumer';
import { GifFrameConsumer } from '../rendering/frame-consumers/gif-frame-consumer';
import { FilesystemFrameConsumer } from '../rendering/frame-consumers/filesystem-frame-consumer';
import { FrameFolderUtilities } from '../pipeline-common/frame-folder-utilities';
import { AggregateFrameConsumer } from '../rendering/frame-consumers/aggregate-frame-consumer';

export class RenderCommandFactory implements ICommandFactory {
  public create(options: SessionOptions): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const snapshotProducer: ISnapshotProducer = new FilesystemSnapshotProducer (
      options.inputFolder,
      new SnapshotFolderUtilities());

    const snapshotConsumer: ISnapshotConsumer = new RenderingSnapshotConsumer(
      new AggregateFrameConsumer(
        [
          new FilesystemFrameConsumer(
            options.outputFolder || options.inputFolder,
            new FrameFolderUtilities()),
          new GifFrameConsumer(options.outputFolder || options.inputFolder),
        ]));

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

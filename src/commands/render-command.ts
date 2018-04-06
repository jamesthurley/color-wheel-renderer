import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { DisplayableError } from '../common/displayable-error';
import { SnapshotFolderUtilities } from '../recording/snapshot-folder-utilities';
import { FilesystemSnapshotProducer } from '../recording/snapshot-producers/filesystem-snapshot-producer';
import { ISnapshotProducer } from '../recording/snapshot-producers/snapshot-producer';
import { SessionRunner } from '../recording/sessions/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { ISnapshotConsumer } from '../recording/snapshot-consumers/snapshot-consumer';
import { PhotoOnlySnapshotConsumer } from '../rendering/photo-only-snapshot-consumer';
import { GifFrameConsumer } from '../rendering/frame-consumers/gif-frame-consumer';

export class RenderCommandFactory implements ICommandFactory {
  public create(options: Options): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const snapshotProducer: ISnapshotProducer = new FilesystemSnapshotProducer (
      options.inputFolder,
      new SnapshotFolderUtilities());

    const snapshotConsumer: ISnapshotConsumer = new PhotoOnlySnapshotConsumer(
      new GifFrameConsumer(options.outputFolder || options.inputFolder));

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

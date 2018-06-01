import { SessionOptions } from './session-options';
import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { DisplayableError } from '../../common/displayable-error';
import { SnapshotFolderUtilities } from '../../sessions/pipeline-common/snapshot-folder-utilities';
import { FilesystemSnapshotProducer } from '../../sessions/rendering/snapshot-producers/filesystem-snapshot-producer';
import { ISnapshotProducer } from '../../sessions/pipeline/snapshot-producer';
import { SessionRunner } from '../../sessions/pipeline/session-runner';
import { SessionRunningCommand } from './session-running-command';
import { ISnapshotConsumer } from '../../sessions/pipeline/snapshot-consumer';
import { RenderingSnapshotConsumer } from '../../sessions/rendering/snapshot-consumers/rendering-snapshot-consumer';
import { GifFrameConsumer } from '../../sessions/rendering/frame-consumers/gif-frame-consumer';
import { FilesystemFrameConsumer } from '../../sessions/rendering/frame-consumers/filesystem-frame-consumer';
import { FrameFolderUtilities } from '../../sessions/pipeline-common/frame-folder-utilities';
import { AggregateFrameConsumer } from '../../sessions/rendering/frame-consumers/aggregate-frame-consumer';
import { Mp4FrameConsumer } from '../../sessions/rendering/frame-consumers/mp4-frame-consumer';
import { TransitioningFrameConsumer } from '../../sessions/rendering/frame-consumers/transitioning-frame-consumer';
import { Format } from '../../sessions/rendering/format';
import { IFrameConsumer } from '../../sessions/pipeline/frame-consumer';

const framesPerSecond = 25;

export class RenderCommandFactory implements ICommandFactory<SessionOptions> {
  public create(options: SessionOptions): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const format = options.definedFormat;
    const formatFrameConsumers: IFrameConsumer[] = [];
    if (format === Format.gif || format === Format.all) {
      formatFrameConsumers.push(new GifFrameConsumer(options.gifQuantizer, options.outputFolder || options.inputFolder));
    }
    if (format === Format.mp4 || format === Format.all) {
      formatFrameConsumers.push(new Mp4FrameConsumer(framesPerSecond, options.outputFolder || options.inputFolder));
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
          new TransitioningFrameConsumer(framesPerSecond, options.transitionFrames, new AggregateFrameConsumer(formatFrameConsumers)),
        ]));

    const sessionRunner = new SessionRunner(
      snapshotProducer,
      snapshotConsumer);

    return new SessionRunningCommand(sessionRunner);
  }
}

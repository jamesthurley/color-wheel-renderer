import { Log } from '../common/log';
import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { DisplayableError } from '../common/displayable-error';
import { SnapshotFolderUtilities } from '../recording/snapshot-folder-utilities';
import { ISessionProducer, SessionProducer } from '../recording/session-producers/session-producer';
import { FilesystemSnapshotProducer } from '../recording/snapshot-producers/filesystem-snapshot-producer';

export class RenderCommandFactory implements ICommandFactory {
  public create(options: Options): ICommand {

    if (!options.inputFolder) {
      throw new DisplayableError('Input session folder must be provided.');
    }

    const sessionProducer: ISessionProducer = new SessionProducer(
      new FilesystemSnapshotProducer (
        options.inputFolder,
        new SnapshotFolderUtilities()));

    return new RenderCommand(sessionProducer);
  }
}

export class RenderCommand implements ICommand {
  constructor(
    private readonly sessionProducer: ISessionProducer) {
  }

  public async execute(): Promise<void> {
    Log.info('Render:' + this.sessionProducer);
  }
}

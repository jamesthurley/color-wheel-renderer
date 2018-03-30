import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { ISnapshotProducer } from '../recording/snapshot-producers/snapshot-producer';
import { FilesystemScreenshotProducer } from '../recording/screenshot-producers/filesystem-screenshot-producer';
import { ImpatientSnapshotProducer } from '../recording/snapshot-producers/impatient-snapshot-producer';
import { SnapshotFolderUtilities } from '../recording/snapshot-folder-utilities';
import { ISnapshotPersister } from '../recording/snapshot-persisters/snapshot-persister';
import { RecordCommand } from './record-command';
import { LoggingComparingSnapshotPersister } from '../recording/snapshot-persisters/logging-comparing-snapshot-persister';

export class TestCommandFactory implements ICommandFactory {
  public create(options: Options): ICommand {

    const snapshotProducer: ISnapshotProducer = new ImpatientSnapshotProducer(
      new FilesystemScreenshotProducer(
        options.inputFolder,
        new SnapshotFolderUtilities()),
      options.definedEditor);

    const snapshotPersister: ISnapshotPersister = new LoggingComparingSnapshotPersister(
      options.inputFolder,
      new SnapshotFolderUtilities());

    return new RecordCommand(snapshotProducer, snapshotPersister);  }
}

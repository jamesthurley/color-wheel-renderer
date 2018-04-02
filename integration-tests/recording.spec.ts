import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/recording/snapshot-producers/snapshot-producer';
import { ImpatientSnapshotProducer } from '../src/recording/snapshot-producers/impatient-snapshot-producer';
import { FilesystemScreenshotProducer } from '../src/recording/screenshot-producers/filesystem-screenshot-producer';
import { SnapshotFolderUtilities } from '../src/recording/snapshot-folder-utilities';
import { RecordCommand } from '../src/commands/record-command';
import { EditorFactoryMap } from '../src/editors/editor-factory-map';
import { IntegrationTestComparingSnapshotPersister } from '../src/recording/snapshot-persisters/integration-test-comparing-snapshot-persister';

const macro: Macro = async (t, inputFolder: string, editorType: string) => {

  const editorFactory = EditorFactoryMap.get(editorType);
  if (!editorFactory) {
    t.fail('Unknown editor: ' + editorType);
  }

  const editor = editorFactory!();

  inputFolder = './integration-tests/input-data/recorded-sessions/' + inputFolder;

  const snapshotProducer: ISnapshotProducer = new ImpatientSnapshotProducer(
    new FilesystemScreenshotProducer(
      inputFolder,
      new SnapshotFolderUtilities()),
    editor);

  const snapshotPersister = new IntegrationTestComparingSnapshotPersister(
    inputFolder,
    new SnapshotFolderUtilities());

  const record = new RecordCommand(snapshotProducer, snapshotPersister);

  await record.execute();

  for (const comparison of snapshotPersister.comparisons) {
    t.deepEqual(comparison.actual, comparison.expected, comparison.message);
  }
};

macro.title = (providedTitle: string, inputFolder: string, editorType: string) => `Test Recording: ${inputFolder} / ${editorType}`.trim();

test(macro, 'lightroom-classic-windows-10-smart-collection-icon-in-center-y', 'lightroom-windows');

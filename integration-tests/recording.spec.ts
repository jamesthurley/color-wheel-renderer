import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/recording/snapshot-producers/snapshot-producer';
import { ImpatientSnapshotProducer } from '../src/recording/snapshot-producers/impatient-snapshot-producer';
import { FilesystemScreenshotProducer } from '../src/recording/screenshot-producers/filesystem-screenshot-producer';
import { SnapshotFolderUtilities } from '../src/recording/snapshot-folder-utilities';
import { EditorFactoryMap } from '../src/editors/editor-factory-map';
import { SessionRunner, ISessionRunner } from '../src/recording/sessions/session-runner';
import { IntegrationTestSnapshotConsumer } from '../src/recording/snapshot-consumers/integration-test-snapshot-consumer';

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

  const snapshotConsumer = new IntegrationTestSnapshotConsumer(
    inputFolder,
    new SnapshotFolderUtilities());

  const sessionRunner: ISessionRunner = new SessionRunner(
    snapshotProducer,
    snapshotConsumer);

  await sessionRunner.run();

  for (const comparison of snapshotConsumer.comparisons) {
    t.deepEqual(comparison.actual, comparison.expected, comparison.message);
  }
};

macro.title = (providedTitle: string, inputFolder: string, editorType: string) => `Test Recording: ${inputFolder} / ${editorType}`.trim();

test(macro, 'lightroom-classic-windows-10-smart-collection-icon-in-center-y', 'lightroom-windows');

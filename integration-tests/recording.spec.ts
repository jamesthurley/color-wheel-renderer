import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/pipeline/snapshot-producer';
import { ImpatientSnapshotProducer } from '../src/testing/snapshot-producers/impatient-snapshot-producer';
import { FilesystemScreenshotProducer } from '../src/testing/screenshot-producers/filesystem-screenshot-producer';
import { SnapshotFolderUtilities } from '../src/pipeline-common/snapshot-folder-utilities';
import { EditorFactoryMap } from '../src/editors/editor-factory-map';
import { SessionRunner, ISessionRunner } from '../src/pipeline/session-runner';
import { IntegrationTestSnapshotConsumer } from '../src/testing/snapshot-consumers/integration-test-snapshot-consumer';

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

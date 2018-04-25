import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/sessions/pipeline/snapshot-producer';
import { ImpatientSnapshotProducer } from '../src/sessions/testing/snapshot-producers/impatient-snapshot-producer';
import { FilesystemScreenshotProducer } from '../src/sessions/testing/screenshot-producers/filesystem-screenshot-producer';
import { SnapshotFolderUtilities } from '../src/sessions/pipeline-common/snapshot-folder-utilities';
import { EditorFactoryMap } from '../src/sessions/editors/editor-factory-map';
import { SessionRunner, ISessionRunner } from '../src/sessions/pipeline/session-runner';
import { ComparingSnapshotConsumer } from '../src/sessions/testing/snapshot-consumers/comparing-snapshot-consumer';
import { IntegrationTestConsumerHelper } from '../src/sessions/testing/integration-test-consumer-helper';
import { ISnapshotConsumer } from '../src/sessions/pipeline/snapshot-consumer';
import { evaluateComparisons } from './evaluate-comparisons';

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

  const comparisonHelper = new IntegrationTestConsumerHelper();
  const snapshotConsumer: ISnapshotConsumer = new ComparingSnapshotConsumer(
    comparisonHelper,
    inputFolder,
    new SnapshotFolderUtilities());

  const sessionRunner: ISessionRunner = new SessionRunner(
    snapshotProducer,
    snapshotConsumer);

  await sessionRunner.run();

  await evaluateComparisons(t, comparisonHelper);
};

macro.title = (providedTitle: string, inputFolder: string, editorType: string) => `Test Recording: ${inputFolder} / ${editorType}`.trim();

test(macro, 'lightroom-classic-windows-10-smart-collection-icon-in-center-y', 'lightroom-windows');

import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/pipeline/snapshot-producer';
import { SnapshotFolderUtilities } from '../src/pipeline-common/snapshot-folder-utilities';
import { SessionRunner, ISessionRunner } from '../src/pipeline/session-runner';
import { IntegrationTestConsumerHelper } from '../src/testing/integration-test-consumer-helper';
import { ISnapshotConsumer } from '../src/pipeline/snapshot-consumer';
import { FilesystemSnapshotProducer } from '../src/rendering/snapshot-producers/filesystem-snapshot-producer';
import { RenderingSnapshotConsumer } from '../src/rendering/snapshot-consumers/rendering-snapshot-consumer';
import { ComparingFrameConsumer } from '../src/testing/frame-consumers/comparing-frame-consumer';
import { evaluateComparisons } from './evaluate-comparisons';
import { FrameFolderUtilities } from '../src/pipeline-common/frame-folder-utilities';

const macro: Macro = async (t, inputFolder: string) => {

  inputFolder = './integration-tests/input-data/recorded-sessions/' + inputFolder;

  const snapshotProducer: ISnapshotProducer = new FilesystemSnapshotProducer(
    inputFolder,
    new SnapshotFolderUtilities());

  const comparisonHelper = new IntegrationTestConsumerHelper();
  const snapshotConsumer: ISnapshotConsumer = new RenderingSnapshotConsumer(
    new ComparingFrameConsumer(
        comparisonHelper,
        inputFolder,
        new FrameFolderUtilities()));

  const sessionRunner: ISessionRunner = new SessionRunner(
    snapshotProducer,
    snapshotConsumer);

  await sessionRunner.run();

  await evaluateComparisons(t, comparisonHelper);
};

macro.title = (providedTitle: string, inputFolder: string, editorType: string) => `Test Rendering: ${inputFolder}`.trim();

test(macro, 'lightroom-classic-windows-10-smart-collection-icon-in-center-y');

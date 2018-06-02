import test, { Macro } from 'ava';
import { ISnapshotProducer } from '../src/sessions/pipeline/snapshot-producer';
import { SnapshotFolderUtilities } from '../src/sessions/pipeline-common/snapshot-folder-utilities';
import { SessionRunner, ISessionRunner } from '../src/sessions/pipeline/session-runner';
import { IntegrationTestConsumerHelper } from '../src/sessions/testing/integration-test-consumer-helper';
import { ISnapshotConsumer } from '../src/sessions/pipeline/snapshot-consumer';
import { FilesystemSnapshotProducer } from '../src/sessions/rendering/snapshot-producers/filesystem-snapshot-producer';
import { RenderingSnapshotConsumer } from '../src/sessions/rendering/snapshot-consumers/rendering-snapshot-consumer';
import { ComparingFrameConsumer } from '../src/sessions/testing/frame-consumers/comparing-frame-consumer';
import { evaluateComparisons } from './evaluate-comparisons';
import { FrameFolderUtilities } from '../src/sessions/pipeline-common/frame-folder-utilities';
import { setTestLogLevel } from './set-test-log-level';

const macro: Macro = async (t, inputFolder: string) => {
  setTestLogLevel();

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

macro.title = (providedTitle: string, inputFolder: string) => `Integration Test: Session Rendering: ${inputFolder}`.trim();

test(macro, 'lightroom-classic-windows-10-smart-collection-icon-in-center-y');

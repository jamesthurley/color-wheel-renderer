import { PatientSnapshotProducer } from '../../recording/snapshot-producers/patient-snapshot-producer';
import { IScreenshotProducer } from '../../pipeline/screenshot-producer';
import { IEditor } from '../../editors/editor';

export class ImpatientSnapshotProducer extends PatientSnapshotProducer {
  constructor(
    screenshotProducer: IScreenshotProducer,
    editor: IEditor) {
      super(0, 0, screenshotProducer, editor);
  }
}

import { Constants } from '../../common/constants';
import { NumberedFolderUtilitiesBase } from './numbered-folder-utilities-base';

export class SnapshotFolderUtilities extends NumberedFolderUtilitiesBase {
  constructor() {
    super(Constants.SnapshotFolderPrefix);
  }
}

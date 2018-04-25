import { Constants } from '../../common/constants';
import { NumberedFolderUtilitiesBase } from './numbered-folder-utilities-base';

export class FrameFolderUtilities extends NumberedFolderUtilitiesBase {
  constructor() {
    super(Constants.FrameFolderPrefix);
  }
}

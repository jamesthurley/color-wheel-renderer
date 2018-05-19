import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';
import { IEditor } from './editor';
import { WithDebugImages } from '../pipeline/with-debug-images';

export abstract class EditorBase implements IEditor {
  public abstract findPhotoRectangle(image: Jimp): WithDebugImages<IRectangle | undefined>;
  public abstract findActiveHistoryItemRectangle(image: Jimp): WithDebugImages<IRectangle | undefined>;
}

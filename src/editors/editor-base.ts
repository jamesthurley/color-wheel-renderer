import * as Jimp from 'jimp';
import { IRectangle } from '../common/rectangle';
import { IEditor } from './editor';

export abstract class EditorBase implements IEditor {
  public abstract findPhotoRectangle(image: Jimp): IRectangle | undefined;
  public abstract findActiveHistoryItemRectangle(image: Jimp): IRectangle | undefined;
}

import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';

export interface IEditor {
  findPhotoRectangle(image: Jimp): IRectangle | undefined;
  findActiveHistoryItemRectangle(image: Jimp): IRectangle | undefined;
}

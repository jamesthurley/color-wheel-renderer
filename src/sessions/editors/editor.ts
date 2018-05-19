import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';
import { WithDebugImages } from '../pipeline/with-debug-images';

export interface IEditor {
  findPhotoRectangle(image: Jimp): WithDebugImages<IRectangle | undefined>;
  findActiveHistoryItemRectangle(image: Jimp): WithDebugImages<IRectangle | undefined>;
}

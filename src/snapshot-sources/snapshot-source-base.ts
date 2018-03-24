import * as Jimp from 'jimp';
import { IRectangle } from '../common/rectangle';

export abstract class SnapshotSourceBase {
  abstract findPhotoRectangle(image: Jimp): IRectangle | null;
  abstract findActiveHistoryItemRectangle(image: Jimp): IRectangle | null;
}

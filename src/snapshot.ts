import * as Jimp from 'jimp';
import { FindPhotoRectangleResult } from './find-photo-rectangle';
import { IRectangle } from './rectangle';

export class Snapshot{
  constructor(
    public readonly photoRectangle: FindPhotoRectangleResult,
    public readonly photo: Jimp,
    public readonly historyItemRectangle: IRectangle,
    public readonly historyItem: Jimp) {
    }
}

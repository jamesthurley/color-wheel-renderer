import * as Jimp from 'jimp';
import { IRectangle } from '../common/rectangle';
import { IEditor } from './editor';

export abstract class EditorBase implements IEditor {
  abstract findPhotoRectangle(image: Jimp): IRectangle | null;
  abstract findActiveHistoryItemRectangle(image: Jimp): IRectangle | null;

  protected getPixelAtIndex(image: Jimp, index: number): Pixel {
    const red = image.bitmap.data[index + 0];
    const green = image.bitmap.data[index + 1];
    const blue = image.bitmap.data[index + 2];

    return new Pixel(red, green, blue);
  }
}

export class Pixel {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number) {
  }
}

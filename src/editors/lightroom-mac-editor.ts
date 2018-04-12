import { LightroomEditor } from './lightroom-editor';
import { Pixel } from '../common/pixel';

export const LightroomMacEditorKey = 'lightroom-mac';

export class LightroomMacEditor extends LightroomEditor {

  protected isPhotoBorderColor(pixel: Pixel): boolean {
    return this.isPhotoBorderGrayscale(pixel.red)
      && this.isPhotoBorderGrayscale(pixel.green)
      && this.isPhotoBorderGrayscale(pixel.blue);
  }

  protected isActiveHistoryItemColor(pixel: Pixel): boolean {
    return this.isActiveHistoryItemGrayscale(pixel.red)
      && this.isActiveHistoryItemGrayscale(pixel.green)
      && this.isActiveHistoryItemGrayscale(pixel.blue);
  }

  private isPhotoBorderGrayscale(color: number) {
    const min = 135;
    const max = 150;
    return color >= min && color <= max;
  }

  private isActiveHistoryItemGrayscale(color: number) {
    const min: number = 190;
    const max: number = 220;
    return color >= min && color <= max;
  }
}

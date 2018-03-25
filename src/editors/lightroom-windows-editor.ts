import { LightroomEditor } from './lightroom-editor';
import { Pixel } from './editor-base';

export const LightroomWindowsEditorKey = 'lightroom-windows';

export class LightroomWindowsEditor extends LightroomEditor {

  protected isPhotoBorderColor(pixel: Pixel): boolean {
    return this.isPhotoBorderGrayscale(pixel.red)
      && this.isPhotoBorderGrayscale(pixel.green)
      && this.isPhotoBorderGrayscale(pixel.blue);
  }

  private isPhotoBorderGrayscale(color: number) {
    const min = 127;
    const max = 128;
    return color >= min && color <= max;
  }

  protected isActiveHistoryItemColor(pixel: Pixel): boolean {
    return this.isActiveHistoryItemGrayscale(pixel.red)
      && this.isActiveHistoryItemGrayscale(pixel.green)
      && this.isActiveHistoryItemGrayscale(pixel.blue);
  }

  private isActiveHistoryItemGrayscale(color: number) {
    const min: number = 178;
    const max: number = 178;
    return color >= min && color <= max;
  }
}

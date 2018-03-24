import { LightroomEditor } from './lightroom-editor';

export const LightroomMacEditorKey = 'lightroom-mac';

export class LightroomMacEditor extends LightroomEditor {

  protected isPhotoBorderColor(r: number, g: number, b: number): boolean {
    return this.isPhotoBorderGrayscale(r) && this.isPhotoBorderGrayscale(g) && this.isPhotoBorderGrayscale(b);
  }

  private isPhotoBorderGrayscale(color: number) {
    const min = 135;
    const max = 150;
    return color >= min && color <= max;
  }


  protected isActiveHistoryItemColor(r: number, g: number, b: number): boolean {
    return this.isActiveHistoryItemGrayscale(r) && this.isActiveHistoryItemGrayscale(g) && this.isActiveHistoryItemGrayscale(b);
  }

  private isActiveHistoryItemGrayscale(color: number) {
    const min: number = 190;
    const max: number = 220;
    return color >= min && color <= max;
  }
}

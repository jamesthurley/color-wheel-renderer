import { IRectangle, Rectangle } from './rectangle';

export interface IBorder {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export class Border implements IBorder {
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly right: number,
    public readonly bottom: number) {
  }

  public toRectangle(): IRectangle {
    return new Rectangle(
      this.left,
      this.top,
      (this.right - this.left) + 1,
      (this.bottom - this.top) + 1);
  }
}

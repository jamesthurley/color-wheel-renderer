
export interface IRectangle {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export class Rectangle implements IRectangle {
  constructor(
    public readonly left: number,
    public readonly top: number,
    public readonly width: number,
    public readonly height: number) {
  }
}

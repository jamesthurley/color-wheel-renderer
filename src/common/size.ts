export interface ISize {
  readonly width: number;
  readonly height: number;
}

export class Size {
  constructor(
    public readonly width: number,
    public readonly height: number) {
  }
}

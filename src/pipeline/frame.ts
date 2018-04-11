import * as Jimp from 'jimp';

export interface IFrame {
  readonly image: Jimp;
  readonly durationCentiseconds: number;
}

export class Frame implements IFrame {
  constructor(
    public readonly image: Jimp,
    public readonly durationCentiseconds: number) {
  }
}

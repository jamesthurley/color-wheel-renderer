import * as Jimp from 'jimp';

export class DebugImage {
  constructor(
    public readonly fileName: string,
    public readonly image: Jimp) {
    }
}

import * as Jimp from 'jimp';
import { FrameMetadata } from './frame-metadata';

export interface IFrame {
  readonly image: Jimp;
  readonly metadata: FrameMetadata;
}

export class Frame implements IFrame {
  constructor(
    public readonly image: Jimp,
    public readonly metadata: FrameMetadata) {
  }
}

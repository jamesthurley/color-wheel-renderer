import * as Jimp from 'jimp';

export interface IComparingConsumerHelper {
  readonly consumedCount: number;
  consumedType: string;
  incrementConsumedCount(): void;
  compareObject(expected: any, actual: any, type: string): Promise<void>;
  compareImage(expected: Jimp, actual: Jimp, type: string): Promise<void>;
}

import * as Jimp from 'jimp';
import { ComparingConsumerHelperBase } from './comparing-consumer-helper-base';

export class IntegrationTestConsumerHelper extends ComparingConsumerHelperBase {
  private readonly writableObjectComparisons: ObjectComparison[] = [];
  private readonly writableImageComparisons: ImageComparison[] = [];

  public get objectComparisons(): ReadonlyArray<ObjectComparison> {
    return [...this.writableObjectComparisons];
  }

  public get imageComparisons(): ReadonlyArray<ImageComparison> {
    return [...this.writableImageComparisons];
  }

  public compareObject(expected: any, actual: any, type: string): Promise<void> {
    this.writableObjectComparisons.push(new ObjectComparison(
      `${this.consumedType} ${this.consumedCount} ${type} differs.`,
      expected,
      actual));

    return Promise.resolve();
  }

  public compareImage(expected: Jimp, actual: Jimp, type: string): Promise<void> {
    this.writableImageComparisons.push(new ImageComparison(
      `${this.consumedType} ${this.consumedCount} ${type} differs.`,
      expected,
      actual));

    return Promise.resolve();
  }
}

export class ObjectComparison {
  constructor(
    public readonly message: string,
    public readonly expected: any,
    public readonly actual: any) {
  }
}

export class ImageComparison {
  constructor(
    public readonly message: string,
    public readonly expected: Jimp,
    public readonly actual: Jimp) {
  }
}

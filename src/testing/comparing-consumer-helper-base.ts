import * as Jimp from 'jimp';
import { IComparingConsumerHelper } from './comparing-consumer-helper';
import { DisplayableError } from '../common/displayable-error';

export abstract class ComparingConsumerHelperBase implements IComparingConsumerHelper {

  private writableConsumedCount: number = 0;
  private writableConsumedType: string;

  public get consumedCount(): number {
    return this.writableConsumedCount;
  }

  public get consumedType(): string {
    return this.writableConsumedType;
  }

  public set consumedType(value: string) {
    if (this.writableConsumedType) {
      throw new DisplayableError('Consumed type cannot be set more than once.');
    }

    this.writableConsumedType = value;
  }

  public incrementConsumedCount() {
    ++this.writableConsumedCount;
  }

  public abstract compareObject(expected: any, actual: any, type: string): Promise<void>;
  public abstract compareImage(expected: Jimp, actual: Jimp, type: string): Promise<void>;
}

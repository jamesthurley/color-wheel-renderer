import * as Jimp from 'jimp';
import { ComparingConsumerHelperBase } from './comparing-consumer-helper-base';
import { jsonEquals } from '../common/json-equals';
import { jsonStringify } from '../common/json-stringify';
import { Log } from '../common/log';
import { compareImage } from '../common/compare-image';

export class LoggingConsumerHelper extends ComparingConsumerHelperBase {

  public compareObject(expected: any, actual: any, type: string): Promise<void> {
    if (!jsonEquals(expected, actual)) {

      const failureMessage = `${this.consumedType} ${this.consumedCount} ${type} differs.
Expected:
${jsonStringify(expected)}
Actual:
${jsonStringify(actual)}`;

      Log.error(failureMessage);
    }
    else {
      Log.info(`${this.consumedType} ${this.consumedCount} ${type} matches.`);
    }

    return Promise.resolve();
  }

  public async compareImage(expected: Jimp, actual: Jimp, type: string): Promise<void> {
    const result = await compareImage(expected, actual);

    if (result.differences.length) {
      const failureMessage = [
        `${this.consumedType} ${this.consumedCount} ${type} differs.`,
        ...result.differences,
      ].join('\n');

      Log.error(failureMessage);
    }
    else {
      Log.info(`${this.consumedType} ${this.consumedCount} ${type} matches.`);
    }

    return Promise.resolve();
  }
}

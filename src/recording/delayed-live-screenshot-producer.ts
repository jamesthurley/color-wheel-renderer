import * as Jimp from 'jimp';
import { IScreenshotProducer } from './screenshot-producer';
import { sleep } from '../common/sleep';

export class DelayedLiveScreenshotProducer implements IScreenshotProducer {

  constructor(
    private readonly delayMilliseconds: number,
    private readonly screenshotProducer: IScreenshotProducer){
    }

  public async getScreenshot(): Promise<Jimp> {
    await sleep(this.delayMilliseconds);
    return await this.screenshotProducer.getScreenshot();
  }
}

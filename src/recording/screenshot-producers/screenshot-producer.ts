import * as Jimp from 'jimp';

export interface IScreenshotProducer {
  getScreenshot(): Promise<Jimp | undefined>
}

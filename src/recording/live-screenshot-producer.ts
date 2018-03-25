import * as Jimp from 'jimp';
import * as screenshot from 'desktop-screenshot';
import * as fs from 'fs';
import { IScreenshotProducer } from './screenshot-producer';

export class LiveScreenshotProducer implements IScreenshotProducer {
  public async getScreenshot(): Promise<Jimp> {
    const screenshotName = 'temp';
    await this.takeScreenshot(screenshotName);
    const image = await this.readImage(screenshotName);
    this.deleteScreenshot(screenshotName);
    return image;
  }

  private async takeScreenshot(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      screenshot(`${name}.png`, (error: Error) => {
        if (error) { reject(error); }
        else { resolve(); }
      });
    });
  }

  private async readImage(name: string): Promise<Jimp> {
    return new Promise<Jimp>((resolve, reject) => {
      Jimp.read(`${name}.png`, (err, image) => {
        if (err) { reject(err); }
        else { resolve(image); }
      });
    });
  }

  private deleteScreenshot(name: string): void {
    fs.unlinkSync(`${name}.png`);
  }
}

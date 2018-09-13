import * as Jimp from 'jimp';
import * as screenshot from 'desktop-screenshot';
import * as fs from 'fs';
import { IScreenshotProducer } from '../../pipeline/screenshot-producer';
import { sleep } from '../../../common/sleep';

const WAIT_FOR_RETRY_DELETE_MILLISECONDS = 1000;

export class LiveScreenshotProducer implements IScreenshotProducer {
  public async getScreenshot(): Promise<Jimp | undefined> {
    const screenshotName = 'temp';
    await this.takeScreenshot(screenshotName);
    const image = await this.readImage(screenshotName);
    await this.deleteScreenshot(screenshotName);
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

  private async deleteScreenshot(name: string): Promise<void> {
    for (let attempt = 0; attempt < 3; ++attempt) {
      try {
        fs.unlinkSync(`${name}.png`);
        return;
      }
      catch (error) {
        await sleep(WAIT_FOR_RETRY_DELETE_MILLISECONDS);
      }
    }
  }
}

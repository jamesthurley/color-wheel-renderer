import * as Jimp from 'jimp';
import * as screenshot from 'desktop-screenshot';
import * as fs from 'fs';

export async function getScreenshotAsync(): Promise<Jimp> {
  const screenshotName = 'temp';
  await takeScreenshotAsync(screenshotName);
  const image = await readImageAsync(screenshotName);
  deleteScreenshot(screenshotName);
  return image;
}

async function takeScreenshotAsync(name: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    screenshot(`${name}.png`, (error: Error) => {
      if (error) { reject(error); }
      else { resolve(); }
    });
  });
}

async function readImageAsync(name: string): Promise<Jimp> {
  return new Promise<Jimp>((resolve, reject) => {
    Jimp.read(`${name}.png`, (err, image) => {
      if (err) { reject(err); }
      else { resolve(image); }
    });
  });
}

function deleteScreenshot(name: string): void {
  fs.unlinkSync(`${name}.png`);
}

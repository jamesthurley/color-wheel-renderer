import * as Jimp from 'jimp';
import { ICommandFactory } from './command-factory';
import { SessionOptions } from '../session-options';
import { ICommand } from './command';
import { DisplayableError } from '../common/displayable-error';
import { Pixel } from '../common/pixel';
import { Log } from '../common/log';
import { join } from 'path';

export class RenderColorWheelCommandFactory implements ICommandFactory {
  public create(options: SessionOptions): ICommand {

    if (!options.outputFile) {
      throw new DisplayableError('Output folder must be provided.');
    }

    return new RenderColorWheelCommand(options.outputFile);
  }
}

class RenderColorWheelCommand implements ICommand {
  constructor(
    public readonly outputFile: string) {
  }

  public execute(): Promise<void> {

    const imageWidth = 1024;
    const imageHeight = 1024;

    const border = 8;
    const buckets = 10;

    const wheelDiameter = Math.min(imageWidth, imageHeight) - border;

    const centerX = Math.floor(imageWidth / 2);
    const centerY = Math.floor(imageHeight / 2);

    const edgeDistance = wheelDiameter / 2;
    const gradientDistance = edgeDistance / 2;

    if (gradientDistance < 1) {
      throw new DisplayableError('Image is too small.');
    }

    // https://github.com/oliver-moran/jimp/issues/393
    const image = new (Jimp as any)(imageWidth, imageHeight, 0xFFFFFFFF) as Jimp;

    image.scan(0, 0, imageWidth, imageHeight, (imageX: number, imageY: number, index: number) => {
      const relativeX = imageX - centerX;
      const relativeY = imageY - centerY;
      const distanceFromCenter = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));

      if (distanceFromCenter > edgeDistance) {
        return;
      }

      let saturation = 1;
      let value = 1;

      if (distanceFromCenter > gradientDistance) {
        saturation = 1 - ((distanceFromCenter - gradientDistance) / gradientDistance);
      }
      else {
        value = distanceFromCenter / gradientDistance;
      }

      let angleDegrees = this.getAngleDegrees(0, 0, relativeX, relativeY);
      angleDegrees = this.bucketWrap(angleDegrees, 360, 36);

      // https://www.rapidtables.com/convert/color/hsv-to-rgb.html
      const c = value * saturation;
      const x = c * (1 - Math.abs((angleDegrees / 60) % 2 - 1));
      const m = value - c;

      let i: Pixel;
      if (angleDegrees >= 0 && angleDegrees < 60) {
        i = new Pixel(c, x, 0);
      }
      else if (angleDegrees >= 60 && angleDegrees < 120) {
        i = new Pixel(x, c, 0);
      }
      else if (angleDegrees >= 120 && angleDegrees < 180) {
        i = new Pixel(0, c, x);
      }
      else if (angleDegrees >= 180 && angleDegrees < 240) {
        i = new Pixel(0, x, c);
      }
      else if (angleDegrees >= 240 && angleDegrees < 300) {
        i = new Pixel(x, 0, c);
      }
      else {
        i = new Pixel(c, 0, x);
      }

      const r = (i.red + m) * 255;
      const g = (i.green + m) * 255;
      const b = (i.blue + m) * 255;

      image.bitmap.data[index + 0] = r;
      image.bitmap.data[index + 1] = g;
      image.bitmap.data[index + 2] = b;
    });

    image.write(this.outputFile);

    return Promise.resolve();
  }

  private bucketWrap(v: number, maximum: number, buckets: number): number {
    if (buckets < 1) {
      return v;
    }

    const bucketSize = maximum / buckets;
    let currentBucketMin = 0;
    let currentBucketMax = bucketSize;
    for (let bucketIndex = 0; bucketIndex < buckets; ++bucketIndex) {

      if (v >= currentBucketMin && v < currentBucketMax) {
        return currentBucketMin;
      }

      currentBucketMin = currentBucketMax;
      currentBucketMax += bucketSize;
    }

    return maximum;
  }

  private bucketNoWrap(v: number, maximum: number, buckets: number): number {
    if (buckets < 1) {
      return v;
    }

    const bucketSize = (maximum + 1) / buckets;
    let currentBucketMin = 0;
    let currentBucketMax = bucketSize;
    for (let bucketIndex = 0; bucketIndex < buckets; ++bucketIndex) {

      if (v >= currentBucketMin && v < currentBucketMax) {
        if (bucketIndex === 0) {
          v = 0;
        }
        else if (bucketIndex === buckets - 1) {
          v = 256;
        }
        else {
          v = (currentBucketMin + currentBucketMax) / 2;
        }

        return v;
      }

      currentBucketMin = currentBucketMax;
      currentBucketMax += bucketSize;
    }

    return maximum;
  }

  private getAngleDegrees(centerX: number, centerY: number, relativeX: number, relativeY: number) {
    const angleRadians = Math.PI + Math.atan2(-relativeX + centerX, relativeY - centerY);
    return angleRadians * 180 / Math.PI;
  }
}

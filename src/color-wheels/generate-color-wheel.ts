import * as Jimp from 'jimp';
import { DisplayableError } from '../common/displayable-error';
import { getAngleDegrees } from './get-angle-degrees';
import { bucket } from './bucket';
import { Pixel } from '../common/pixel';

export function generateColorWheel(
  imageWidth: number, imageHeight: number, borderSize: number, hueBuckets: number = 0, saturationBuckets: number = 0): Jimp {

  const wheelDiameter = Math.min(imageWidth, imageHeight) - borderSize;

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
    let distanceFromCenter = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));

    if (distanceFromCenter > edgeDistance) {
      return;
    }

    distanceFromCenter = bucket(distanceFromCenter, edgeDistance, saturationBuckets);

    let saturation = 1;
    let value = 1;

    if (distanceFromCenter > gradientDistance) {
      saturation = 1 - ((distanceFromCenter - gradientDistance) / gradientDistance);
    }
    else {
      value = distanceFromCenter / gradientDistance;
    }

    let angleDegrees = getAngleDegrees(0, 0, relativeX, relativeY);
    angleDegrees = bucket(angleDegrees, 360, hueBuckets);

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

  return image;
}

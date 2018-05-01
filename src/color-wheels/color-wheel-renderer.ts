import * as Jimp from 'jimp';
import { IColorModelPixelRenderer } from './pixel-renderers/color-model-pixel-renderer';
import { bucket } from './bucket';
import { getAngleDegrees } from './get-angle-degrees';
import { DisplayableError } from '../common/displayable-error';

export class ColorWheelRenderer {

  public render(
    imageWidth: number,
    imageHeight: number,
    borderSize: number,
    angleBuckets: number,
    distanceBuckets: number,
    pixelRenderers: ReadonlyArray<IColorModelPixelRenderer>): Jimp {

    const wheelDiameter = Math.min(imageWidth, imageHeight) - borderSize;

    const centerX = Math.floor(imageWidth / 2);
    const centerY = Math.floor(imageHeight / 2);

    const edgeDistance = wheelDiameter / 2;

    // https://github.com/oliver-moran/jimp/issues/393
    const image = new (Jimp as any)(imageWidth, imageHeight, 0xFFFFFFFF) as Jimp;

    if (!pixelRenderers || !pixelRenderers.length) {
      return image;
    }

    const rendererSize = edgeDistance / pixelRenderers.length;
    if (rendererSize < 1) {
      throw new DisplayableError('Image is too small.');
    }

    image.scan(0, 0, imageWidth, imageHeight, (imageX: number, imageY: number, index: number) => {
      const relativeX = imageX - centerX;
      const relativeY = imageY - centerY;
      const distanceFromCenter = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));

      if (distanceFromCenter > edgeDistance) {
        return;
      }

      let variableDimension = 1;

      let rendererInnerDistance = 0;
      let rendererOuterDistance = rendererSize;
      let renderer: IColorModelPixelRenderer | undefined;
      for (const pixelRenderer of pixelRenderers) {
        if (distanceFromCenter < rendererOuterDistance) {
          variableDimension = (distanceFromCenter - rendererInnerDistance) / rendererSize;
          renderer = pixelRenderer;
          break;
        }

        rendererInnerDistance = rendererOuterDistance;
        rendererOuterDistance += rendererSize;
      }

      if (!renderer) {
        return;
      }

      let angleDegrees = getAngleDegrees(0, 0, relativeX, relativeY);

      variableDimension = bucket(variableDimension, 1, distanceBuckets, renderer.varyingDimensionBucketDirection);
      angleDegrees = bucket(angleDegrees, 360, angleBuckets, renderer.angleBucketDirection);

      if (renderer.isVaryingDimensionInverted) {
        variableDimension = 1 - variableDimension;
      }

      if (renderer.isAngleInverted) {
        angleDegrees = 360 - angleDegrees;
      }

      const pixel = renderer.render(angleDegrees, variableDimension);
      if (pixel) {
        image.bitmap.data[index + 0] = pixel.red;
        image.bitmap.data[index + 1] = pixel.green;
        image.bitmap.data[index + 2] = pixel.blue;
      }
    });

    return image;
  }
}

import { ISize, Size } from '../../common/size';

// References:
// http://support.schedugr.am/support/solutions/articles/1000201572-instagram-video-specifications
// http://support.schedugr.am/support/solutions/articles/1000201570-does-schedugram-support-instagram-s-new-rectangular-images-
export const INSTAGRAM_MAX_VIDEO_WIDTH = 1080;
export const INSTAGRAM_MAX_VIDEO_HEIGHT = 1350;
export const INSTAGRAM_MAX_VIDEO_ASPECT_RATIO = 1.91 / 1;
export const INSTAGRAM_MIN_VIDEO_ASPECT_RATIO = 4 / 5;

export class FitFrameSizeToTarget {

  public static execute(frameMetadata: ISize): ISize {

    if (frameMetadata.width > INSTAGRAM_MAX_VIDEO_WIDTH) {
      frameMetadata = new Size(
        INSTAGRAM_MAX_VIDEO_WIDTH,
        Math.floor(frameMetadata.height * (INSTAGRAM_MAX_VIDEO_WIDTH / frameMetadata.width)));
    }

    if (frameMetadata.width / frameMetadata.height > INSTAGRAM_MAX_VIDEO_ASPECT_RATIO) {
      frameMetadata = new Size(
        frameMetadata.width,
        Math.floor(frameMetadata.width / INSTAGRAM_MAX_VIDEO_ASPECT_RATIO));
    }
    else if (frameMetadata.width / frameMetadata.height < INSTAGRAM_MIN_VIDEO_ASPECT_RATIO) {
      frameMetadata = new Size(
        frameMetadata.width,
        Math.floor(frameMetadata.width / INSTAGRAM_MIN_VIDEO_ASPECT_RATIO));
    }

    return frameMetadata;
  }
}

import { IColorWheelConsumer } from './color-wheel-consumer';

export class FilesystemColorWheelConsumer implements IColorWheelConsumer {
  public consume(image: Jimp.Jimp, path: string): Promise<void> {
    image.write(path);
    return Promise.resolve();
  }
}

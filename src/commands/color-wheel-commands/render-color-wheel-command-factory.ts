import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ColorWheelOptions } from './color-wheel-options';
import { RenderColorWheelCommand } from './render-color-wheel-command';

export class RenderColorWheelCommandFactory implements ICommandFactory<ColorWheelOptions> {
  public create(options: ColorWheelOptions): ICommand {
    return new RenderColorWheelCommand(
      options.outputFile,
      options.imageSize,
      options.margin,
      options.bucketCount);
  }
}

import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ColorWheelOptions } from './color-wheel-options';
import { DisplayableError } from '../../common/displayable-error';
import { RenderColorWheelCommand } from './render-color-wheel-command';
import { Size } from '../../common/size';

export class RenderColorWheelCommandFactory implements ICommandFactory<ColorWheelOptions> {
  public create(options: ColorWheelOptions): ICommand {
    return new RenderColorWheelCommand(
      options.outputFile,
      options.imageSize,
      options.margin,
      options.bucketCount);
  }
}

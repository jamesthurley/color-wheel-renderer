import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ColorWheelOptions } from './color-wheel-options';
import { DisplayableError } from '../../common/displayable-error';
import { RenderColorWheelCommand } from './render-color-wheel-command';

export class RenderColorWheelCommandFactory implements ICommandFactory<ColorWheelOptions> {
  public create(options: ColorWheelOptions): ICommand {

    if (!options.outputFile) {
      throw new DisplayableError('Output folder must be provided.');
    }

    return new RenderColorWheelCommand(options.outputFile);
  }
}

import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ColorWheelOptions } from './color-wheel-options';
import { RenderColorWheelCommand } from './render-color-wheel-command';
import { ColorWheelSetRenderer } from '../../color-wheels/color-wheel-set-renderer';
import { ColorWheelRenderer } from '../../color-wheels/color-wheel-renderer';
import { FilesystemColorWheelConsumer } from '../../color-wheels/color-wheel-consumers/filesystem-color-wheel-consumer';

export class RenderColorWheelCommandFactory implements ICommandFactory<ColorWheelOptions> {
  public create(options: ColorWheelOptions): ICommand {
    return new RenderColorWheelCommand(
      options,
      new ColorWheelSetRenderer(new ColorWheelRenderer()),
      new FilesystemColorWheelConsumer());
  }
}

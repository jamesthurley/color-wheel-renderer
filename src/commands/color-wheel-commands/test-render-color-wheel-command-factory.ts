import { ICommandFactory } from '../command-factory';
import { ICommand } from '../command';
import { ColorWheelOptions } from './color-wheel-options';
import { RenderColorWheelCommand } from './render-color-wheel-command';
import { ColorWheelSetRenderer } from '../../color-wheels/color-wheel-set-renderer';
import { ColorWheelRenderer } from '../../color-wheels/color-wheel-renderer';
import { ComparingColorWheelConsumer } from '../../color-wheels/color-wheel-consumers/comparing-color-wheel-consumer';
import { LoggingConsumerHelper } from '../../color-wheels/testing/logging-consumer-helper';

export class TestRenderColorWheelCommandFactory implements ICommandFactory<ColorWheelOptions> {
  public create(options: ColorWheelOptions): ICommand {
    return new RenderColorWheelCommand(
      options,
      new ColorWheelSetRenderer(new ColorWheelRenderer()),
      new ComparingColorWheelConsumer(new LoggingConsumerHelper()));
  }
}

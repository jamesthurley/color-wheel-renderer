import * as commander from 'commander';
import { IUnprocessedColorWheelOptions, ColorWheelType } from './commands/color-wheel-commands/unprocessed-color-wheel-options';
import { ColorWheelOptions } from './commands/color-wheel-commands/color-wheel-options';
import { executeAction } from './execute-action';
import { ColorWheelOptionsProcessor } from './commands/color-wheel-commands/color-wheel-options-processor';
import { RenderColorWheelCommandFactory } from './commands/color-wheel-commands/render-color-wheel-command-factory';
import { verboseOption } from './verbose-option';

function append(value: string, list: string[]) {
  list.push(value);
  return list;
}

export function populateColorWheelCommands(program: commander.CommanderStatic) {
  const hslFixedSaturation = program
    .command('color-wheel-hsl-fixed-saturation')
    .description('Renders HSL color wheels at fixed saturation levels.')
    .action((options: IUnprocessedColorWheelOptions) => {
      options.type = ColorWheelType.HslFixedSaturation;
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    })
    .option('-h --hue-buckets <count>', 'Number of hue buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-s --saturation <number>', 'Saturation values at which to render. Can be specified multiple times. Defaults to 1.', append, [])
    .option('-l --lightness-buckets <count>', 'Number of lightness buckets to divide colors into. Defaults to 0, which gives a smooth output.');
  outputOption(hslFixedSaturation);
  diameterOption(hslFixedSaturation);
  marginOption(hslFixedSaturation);
  expandOption(hslFixedSaturation);
  reverseRadialColorsOption(hslFixedSaturation);
  verboseOption(hslFixedSaturation);

  const hslFixedLightness = program
    .command('color-wheel-hsl-fixed-lightness')
    .description('Renders HSL color wheels at fixed lightness levels.')
    .action((options: IUnprocessedColorWheelOptions) => {
      options.type = ColorWheelType.HslFixedLightness;
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    })
    .option('-h --hue-buckets <count>', 'Number of hue buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-s --saturation-buckets <number>', 'Number of saturation buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-l --lightness <count>', 'Lightness values at which to render. Can be specified multiple times. Defaults to 0.5.', append, []);
  outputOption(hslFixedLightness);
  diameterOption(hslFixedLightness);
  marginOption(hslFixedLightness);
  expandOption(hslFixedLightness);
  reverseRadialColorsOption(hslFixedLightness);
  verboseOption(hslFixedLightness);

  const hsvFixedSaturation = program
    .command('color-wheel-hsv-fixed-saturation')
    .description('Renders HSV color wheels at fixed saturation levels.')
    .action((options: IUnprocessedColorWheelOptions) => {
      options.type = ColorWheelType.HsvFixedSaturation;
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    })
    .option('-h --hue-buckets <count>', 'Number of hue buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-s --saturation <number>', 'Saturation values at which to render. Can be specified multiple times. Defaults to 1.', append, [])
    .option('-v --value-buckets <count>', 'Number of value buckets to divide colors into. Defaults to 0, which gives a smooth output.');
  outputOption(hsvFixedSaturation);
  diameterOption(hsvFixedSaturation);
  marginOption(hsvFixedSaturation);
  expandOption(hsvFixedSaturation);
  reverseRadialColorsOption(hsvFixedSaturation);
  verboseOption(hsvFixedSaturation);

  const hsvFixedValue = program
    .command('color-wheel-hsv-fixed-value')
    .description('Renders HSV color wheels at fixed value levels.')
    .action((options: IUnprocessedColorWheelOptions) => {
      options.type = ColorWheelType.HsvFixedValue;
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    })
    .option('-h --hue-buckets <count>', 'Number of hue buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-s --saturation-buckets <number>', 'Number of saturation buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-v --value <count>', 'Values at which to render. Can be specified multiple times. Defaults to 1.', append, []);
  outputOption(hsvFixedValue);
  diameterOption(hsvFixedValue);
  marginOption(hsvFixedValue);
  expandOption(hsvFixedValue);
  reverseRadialColorsOption(hsvFixedValue);
  verboseOption(hsvFixedValue);
}

function outputOption(command: commander.Command): commander.Command {
  return command.option('-o --output <filePath>', 'Path to file where color wheel should be saved.');
}

function diameterOption(command: commander.Command): commander.Command {
  return command.option('-d --diameter <pixels>', 'Diameter of the color wheel in pixels.');
}

function marginOption(command: commander.Command): commander.Command {
  return command.option('-m --margin <pixels>', 'Size of margin around color wheel in pixels.');
}

function expandOption(command: commander.Command): commander.Command {
  return command.option('-e --expand', 'Add additional wheels to outside of previous wheel.');
}

function reverseRadialColorsOption(command: commander.Command): commander.Command {
  return command.option('-r --reverse-radial-colors', 'Reverses the order of colours from the center to edge of the wheel.');
}

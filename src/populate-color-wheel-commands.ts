import * as commander from 'commander';
import { IUnprocessedColorWheelOptions } from './commands/color-wheel-commands/unprocessed-color-wheel-options';
import { ColorWheelOptions } from './commands/color-wheel-commands/color-wheel-options';
import { executeAction } from './execute-action';
import { ColorWheelOptionsProcessor } from './commands/color-wheel-commands/color-wheel-options-processor';
import { RenderColorWheelCommandFactory } from './commands/color-wheel-commands/render-color-wheel-command-factory';
import { verboseOption } from './verbose-option';
import { TestRenderColorWheelCommandFactory } from './commands/color-wheel-commands/test-render-color-wheel-command-factory';
import { colorWheelTypes } from './commands/color-wheel-commands/color-wheel-type';
import { arrayToString } from './common/array-to-string';

function append(value: string, list: string[]) {
  list.push(value);
  return list;
}

const typesHelp: string = `Type can be one of [${arrayToString(colorWheelTypes())}].`;

export function populateColorWheelCommands(program: commander.CommanderStatic) {
  const colorWheel = program
    .command('color-wheel <type>')
    .description(`Renders one or more color wheels. ${typesHelp}`)
    .action((type: string, options: IUnprocessedColorWheelOptions) => {
      options.type = type;
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    });
  colorWheelOptions(colorWheel);
  verboseOption(colorWheel);

  const testColorWheel = program
  .command('test-color-wheel <type>')
  .description(`Tests rendering one or more color wheels to see if the output has changed. ${typesHelp}`)
  .action((type: string, options: IUnprocessedColorWheelOptions) => {
    options.type = type;
    executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
      options,
      new ColorWheelOptionsProcessor(),
      new TestRenderColorWheelCommandFactory());
  });
  colorWheelOptions(testColorWheel);
  verboseOption(testColorWheel);
}

function colorWheelOptions(command: commander.Command): commander.Command {
  return command
    .option('-a --angular-buckets <count>', 'Number of angular buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-r --radial-buckets <count>', 'Number of radial buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-f --fixed <number>', 'Fixed values at which to render. Can be specified multiple times. Defaults to 0.5 for lightness or 1 for saturation and value.', append, [])
    .option('-o --output <filePath>', 'Path to file where color wheel should be saved.')
    .option('-d --diameter <pixels>', 'Diameter of the color wheel in pixels.')
    .option('-m --margin <pixels>', 'Size of margin around color wheel in pixels.')
    .option('-e --expand', 'Add additional wheels to outside of previous wheel.')
    .option('-c --reverse-radial-colors', 'Reverses the order of colours from the center to edge of the wheel.')
    .option('-b --reverse-radial-bucketing', 'Reverses the direction of radial bucketing from the default. Defaults to outwards, or inwards if colors are reversed.');
}

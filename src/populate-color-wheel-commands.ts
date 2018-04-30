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

const colorWheelTypeMap: { readonly [type: string]: ColorWheelType } = {
  'hsl-fixed-saturation': ColorWheelType.HslFixedSaturation,
  'hsl-fixed-lightness': ColorWheelType.HslFixedLightness,
  'hsv-fixed-saturation': ColorWheelType.HsvFixedSaturation,
  'hsv-fixed-value': ColorWheelType.HsvFixedValue,
};

let typesHelp: string = '';
for (const key of Object.keys(colorWheelTypeMap)) {
  if (typesHelp.length) {
    typesHelp += ', ';
  }
  typesHelp += key;
}
typesHelp = 'Type can be one of [' + typesHelp + '].';

export function populateColorWheelCommands(program: commander.CommanderStatic) {
  const colorWheel = program
    .command('color-wheel <type>')
    .description(`Renders one or more color wheels. ${typesHelp}`)
    .action((type: string, options: IUnprocessedColorWheelOptions) => {
      options.type = colorWheelTypeMap[type];
      executeAction<IUnprocessedColorWheelOptions, ColorWheelOptions>(
        options,
        new ColorWheelOptionsProcessor(),
        new RenderColorWheelCommandFactory());
    })
    .option('-a --angular-buckets <count>', 'Number of angular buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-r --radial-buckets <count>', 'Number of radial buckets to divide colors into. Defaults to 0, which gives a smooth output.')
    .option('-f --fixed <number>', 'Fixed values at which to render. Can be specified multiple times. Defaults to 0.5 for lightness or 1 for saturation and value.', append, [])
    .option('-o --output <filePath>', 'Path to file where color wheel should be saved.')
    .option('-d --diameter <pixels>', 'Diameter of the color wheel in pixels.')
    .option('-m --margin <pixels>', 'Size of margin around color wheel in pixels.')
    .option('-e --expand', 'Add additional wheels to outside of previous wheel.')
    .option('-c --reverse-radial-colors', 'Reverses the order of colours from the center to edge of the wheel.');
  verboseOption(colorWheel);
}

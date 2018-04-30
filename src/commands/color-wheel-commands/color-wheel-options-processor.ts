import { ICommandOptionsProcessor } from '../command-options-processor';
import { IUnprocessedColorWheelOptions } from './unprocessed-color-wheel-options';
import { ColorWheelOptions } from './color-wheel-options';
import { LogLevel } from '../../common/log-level';
import { DisplayableError } from '../../common/displayable-error';
import { Log } from '../../common/log';
import { toNumber } from '../../common/to-number';

export class ColorWheelOptionsProcessor implements ICommandOptionsProcessor<IUnprocessedColorWheelOptions, ColorWheelOptions> {
  public process(unprocessed: IUnprocessedColorWheelOptions): ColorWheelOptions | undefined {

    if (!unprocessed.type) {
      throw new DisplayableError('Unknown color wheel type.');
    }

    const options = {...ColorWheelOptions.default(unprocessed.type)};

    if (unprocessed.verbose) {
      options.logLevel = LogLevel.verbose;
    }

    if (unprocessed.output) {
      if (!unprocessed.output.toLocaleLowerCase().endsWith('.png')) {
        throw new DisplayableError('Output file should have a .png extension.');
      }

      options.outputFile = unprocessed.output;
    }

    if (unprocessed.diameter) {
      const diameter = toNumber(unprocessed.diameter, 'diameter');
      options.diameter = diameter;
    }

    if (unprocessed.margin) {
      options.margin = toNumber(unprocessed.margin, 'margin');
    }

    if (unprocessed.expand) {
      options.expand = unprocessed.expand;
    }

    if (unprocessed.reverseRadialColors) {
      options.reverseRadialColors = unprocessed.reverseRadialColors;
    }

    if (unprocessed.angularBuckets) {
      options.angularBuckets = toNumber(unprocessed.angularBuckets, 'angularBuckets');
    }

    if (unprocessed.radialBuckets) {
      options.radialBuckets = toNumber(unprocessed.radialBuckets, 'radialBuckets');
    }

    if (unprocessed.fixed && unprocessed.fixed.length) {
      options.fixed = unprocessed.fixed.map(v => toNumber(v, 'fixed'));
    }

    Log.logLevel = options.logLevel;
    Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

    return ColorWheelOptions.create(options);
  }
}

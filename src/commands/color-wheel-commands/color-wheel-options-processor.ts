import { ICommandOptionsProcessor } from '../command-options-processor';
import { IUnprocessedColorWheelOptions } from './unprocessed-color-wheel-options';
import { ColorWheelOptions } from './color-wheel-options';
import { LogLevel } from '../../common/log-level';
import { DisplayableError } from '../../common/displayable-error';
import { Log } from '../../common/log';
import { toNumber } from '../../common/to-number';

export class ColorWheelOptionsProcessor implements ICommandOptionsProcessor<IUnprocessedColorWheelOptions, ColorWheelOptions> {
  public process(unprocessed: IUnprocessedColorWheelOptions): ColorWheelOptions | undefined {
    const options = {...ColorWheelOptions.default()};

    if (unprocessed.type) {
      options.type = unprocessed.type;
    }

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

    if (unprocessed.hueBuckets) {
      options.hueBuckets = toNumber(unprocessed.hueBuckets, 'hueBuckets');
    }

    if (unprocessed.saturationBuckets) {
      options.saturationBuckets = toNumber(unprocessed.saturationBuckets, 'saturationBuckets');
    }

    if (unprocessed.lightnessBuckets) {
      options.lightnessBuckets = toNumber(unprocessed.lightnessBuckets, 'lightnessBuckets');
    }

    if (unprocessed.valueBuckets) {
      options.valueBuckets = toNumber(unprocessed.valueBuckets, 'valueBuckets');
    }

    if (unprocessed.saturation && unprocessed.saturation.length) {
      options.saturation = unprocessed.saturation.map(v => toNumber(v, 'saturation'));
    }

    if (unprocessed.lightness && unprocessed.lightness.length) {
      options.lightness = unprocessed.lightness.map(v => toNumber(v, 'lightness'));
    }

    if (unprocessed.value && unprocessed.value.length) {
      options.value = unprocessed.value.map(v => toNumber(v, 'value'));
    }

    Log.logLevel = options.logLevel;
    Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

    return ColorWheelOptions.create(options);
  }
}

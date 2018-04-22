import { ICommandOptionsProcessor } from '../command-options-processor';
import { IUnprocessedColorWheelOptions } from './unprocessed-color-wheel-options';
import { ColorWheelOptions } from './color-wheel-options';
import { LogLevel } from '../../common/log-level';
import { DisplayableError } from '../../common/displayable-error';
import { Log } from '../../common/log';
import { Size } from '../../common/size';
import { toNumber } from '../../common/to-number';

export class ColorWheelOptionsProcessor implements ICommandOptionsProcessor<IUnprocessedColorWheelOptions, ColorWheelOptions> {
  public process(unprocessed: IUnprocessedColorWheelOptions): ColorWheelOptions | undefined {
    const options = {...ColorWheelOptions.default()};

    if (unprocessed.verbose) {
      options.logLevel = LogLevel.verbose;
    }

    if (unprocessed.output) {
      if (!unprocessed.output.toLocaleLowerCase().endsWith('.png')) {
        throw new DisplayableError('Output file should have a .png extension.');
      }

      options.outputFile = unprocessed.output;
    }

    if (unprocessed.height || unprocessed.width) {
      const width = toNumber(unprocessed.width, 'width');
      const height = toNumber(unprocessed.height, 'height');
      options.imageSize = new Size(
        width || height,
        height || width);
    }

    if (unprocessed.margin) {
      options.margin = toNumber(unprocessed.margin, 'margin');
    }

    if (unprocessed.hueBuckets) {
      options.hueBuckets = toNumber(unprocessed.hueBuckets, 'hueBuckets');
    }

    if (unprocessed.saturationBuckets) {
      options.saturationBuckets = toNumber(unprocessed.saturationBuckets, 'saturationBuckets');
    }

    Log.logLevel = options.logLevel;
    Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

    return ColorWheelOptions.create(options);
  }
}

import { ICommandOptionsProcessor } from '../command-options-processor';
import { IUnprocessedColorWheelOptions } from './unprocessed-color-wheel-options';
import { ColorWheelOptions } from './color-wheel-options';
import { LogLevel } from '../../common/log-level';
import { DisplayableError } from '../../common/displayable-error';
import { Log } from '../../common/log';

export class ColorWheelOptionsProcessor implements ICommandOptionsProcessor<IUnprocessedColorWheelOptions, ColorWheelOptions> {
  public process(unprocessed: IUnprocessedColorWheelOptions): ColorWheelOptions | undefined {
    const options = {...ColorWheelOptions.default()};

    if (unprocessed.verbose) {
      options.logLevel = LogLevel.verbose;
    }

    if (unprocessed.useDefaultOutput) {
      options.outputFile = './color-wheel.png';
    }

    if (unprocessed.outputFile) {
      if (!unprocessed.outputFile.toLocaleLowerCase().endsWith('.png')) {
        throw new DisplayableError('Output file should have a .png extension.');
      }

      options.outputFile = unprocessed.outputFile;
    }

    Log.logLevel = options.logLevel;
    Log.verbose('Options: ' + JSON.stringify(options, undefined, 2));

    return ColorWheelOptions.create(options);
  }
}

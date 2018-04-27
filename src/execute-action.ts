import { ICommandOptionsProcessor } from './commands/command-options-processor';
import { ICommandFactory } from './commands/command-factory';
import { Log } from './common/log';

export async function executeAction<TUnprocessedOptions, TOptions>(
  commandLineOptions: TUnprocessedOptions,
  optionsProcessor: ICommandOptionsProcessor<TUnprocessedOptions, TOptions>,
  commandFactory: ICommandFactory<TOptions>) {
  try {
    const options = optionsProcessor.process(commandLineOptions);
    if (options) {
      const command = commandFactory.create(options);
      await command.execute();
      Log.info('Done.');
    }
  }
  catch (error) {
    if (error && error.isDisplayable) {
      Log.error(error.message);
    }
    else {
      Log.error('There was an unexpected error.', error);
    }
  }
}

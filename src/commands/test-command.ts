import { Log } from '../common/log';
import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';

export class TestCommandFactory implements ICommandFactory {
  create(options: Options): ICommand {
    return new TestCommand();
  }
}

export class TestCommand implements ICommand {
  constructor() {
  }

  public async execute(): Promise<void> {
    Log.info('Test');
  }
}

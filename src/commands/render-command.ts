import { Log } from '../common/log';
import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';

export class RenderCommandFactory implements ICommandFactory {
  create(options: Options): ICommand {
    return new RenderCommand();
  }
}

export class RenderCommand implements ICommand {
  constructor() {
  }

  public async execute(): Promise<void> {
    Log.info('Render');
  }
}

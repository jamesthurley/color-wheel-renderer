import { RecordCommandFactory } from './record-command';
import { Options } from '../options';
import { ICommandFactory } from './command-factory';
import { ICommand } from './command';
import { RenderCommandFactory } from './render-command';

export class RunCommandFactory implements ICommandFactory {
  create(options: Options): ICommand {
    const recordCommandFactory = new RecordCommandFactory();
    const renderCommandFactory = new RenderCommandFactory();
    return new RunCommand(
      recordCommandFactory.create(options),
      renderCommandFactory.create(options));
  }
}

export class RunCommand implements ICommand {
  constructor(
    private readonly recordCommand: ICommand,
    private readonly renderCommand: ICommand) {
  }

  public async execute(): Promise<void> {
    await this.recordCommand.execute();
    await this.renderCommand.execute();
  }
}

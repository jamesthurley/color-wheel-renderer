import { ICommand } from '../command';
import { ISessionRunner } from '../../sessions/pipeline/session-runner';

export class SessionRunningCommand implements ICommand {
  constructor(
    private readonly sessionRunner: ISessionRunner) {
  }

  public async execute(): Promise<void> {
    await this.sessionRunner.run();
  }
}

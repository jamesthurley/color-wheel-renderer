import { ICommand } from './command';
import { ISessionRunner } from '../pipeline/session-runner';

export class SessionRunningCommand implements ICommand {
  constructor(
    private readonly sessionRunner: ISessionRunner) {
  }

  public async execute(): Promise<void> {
    await this.sessionRunner.run();
  }
}

import { ICommand } from './command';
import { ISessionRunner } from '../recording/sessions/session-runner';

export class SessionRunningCommand implements ICommand {
  constructor(
    private readonly sessionRunner: ISessionRunner) {
  }

  public async execute(): Promise<void> {
    await this.sessionRunner.run();
  }
}

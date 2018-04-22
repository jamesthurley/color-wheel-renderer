import { ICommand } from './command';

export interface ICommandFactory<TOptions> {
  create(options: TOptions): ICommand;
}

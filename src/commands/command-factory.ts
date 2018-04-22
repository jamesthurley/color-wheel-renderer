import { SessionOptions } from '../session-options';
import { ICommand } from './command';

export interface ICommandFactory {
  create(options: SessionOptions): ICommand;
}

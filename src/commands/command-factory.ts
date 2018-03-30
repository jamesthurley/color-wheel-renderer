import { Options } from '../options';
import { ICommand } from './command';

export interface ICommandFactory {
  create(options: Options): ICommand;
}

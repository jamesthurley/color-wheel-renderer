import * as colors from 'colors';
import { LogLevel } from './log-level';

export class Log {
  public static logLevel: LogLevel;

  public static verbose(text: string) {
    if (Log.logLevel === LogLevel.verbose) {
      console.log(colors.gray(text));
    }
  }

  public static info(text: string) {
    console.log(colors.white(text));
  }

  public static success(text: string) {
    console.log(colors.green(text));
  }

  public static warn(text: string) {
    console.warn(colors.yellow('WARNING: ' + text));
  }

  public static error(text: string, error?: Error) {
    console.error(colors.red('ERROR: ' + text));
    if (error) {
      console.error(colors.red('' + error));
    }
  }

  public static get isVerbose(): boolean {
    return Log.logLevel === LogLevel.verbose;
  }
}

import { LogLevel } from '../options';

export class Log {
  public static logLevel: LogLevel;

  public static verbose(text: string) {
    if (Log.logLevel === LogLevel.verbose) {
      console.log(text);
    }
  }

  public static info(text: string) {
    console.log(text);
  }

  public static warn(text: string) {
    console.warn('WARNING: ' + text);
  }

  public static error(text: string, error?: Error) {
    console.error('ERROR: ' + text);
    if (error) {
      console.error(error);
    }
  }
}

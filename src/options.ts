import { SnapshotSourceBase } from './snapshot-sources/snapshot-source-base';

export enum LogLevel {
  debug = 0,
  info = 1,
}

class OptionsImplementation {
  public logLevel: LogLevel = LogLevel.info;
  public inputFolder: string = '.';
  public outputFolder: string = '.';
  public snapshotSource: SnapshotSourceBase;
}

export const Options: OptionsImplementation = new OptionsImplementation();

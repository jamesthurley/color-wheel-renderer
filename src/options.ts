import { EditorBase } from './editors/editor-base';

export enum LogLevel {
  debug = 0,
  info = 1,
}

class OptionsImplementation {
  public logLevel: LogLevel = LogLevel.info;
  public inputFolder: string = '.';
  public outputFolder: string = '.';
  public editor: EditorBase;
}

export const Options: OptionsImplementation = new OptionsImplementation();

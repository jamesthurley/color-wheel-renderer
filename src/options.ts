
export enum LogLevel {
  debug = 0,
  info = 1,
}

class OptionsImplementation {
  public logLevel: LogLevel = LogLevel.info;
}

export const Options: OptionsImplementation = new OptionsImplementation();

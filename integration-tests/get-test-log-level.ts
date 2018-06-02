import { LogLevel } from '../src/common/log-level';

export function getTestLogLevel(): LogLevel {
  if (process.argv.slice(2).some(v => v === '--verbose')) {
    return LogLevel.verbose;
  }

  return LogLevel.info;
}

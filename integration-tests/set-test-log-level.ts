import { Log } from '../src/common/log';
import { LogLevel } from '../src/common/log-level';

export function setTestLogLevel() {
  if (process.argv.slice(2).some(v => v === '--verbose')) {
    Log.logLevel = LogLevel.verbose;
  }
}

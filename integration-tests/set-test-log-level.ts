import { Log } from '../src/common/log';
import { getTestLogLevel } from './get-test-log-level';

export function setTestLogLevel() {
  Log.logLevel = getTestLogLevel();
}

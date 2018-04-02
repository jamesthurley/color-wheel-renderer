import { Log } from '../common/log';
import { Session } from '../recording/session-producers/session';

export class RenderVideo {
  public execute(session: Session) {
    Log.info('Render video: ' + session);
  }
}

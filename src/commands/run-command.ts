import { recordCommand } from './record-command';
import { renderCommand } from './render-command';

export async function runCommand() {
  recordCommand();
  renderCommand();
}

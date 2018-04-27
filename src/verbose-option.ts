import * as program from 'commander';

export function verboseOption(command: program.Command): program.Command {
  return command.option('--verbose', 'Enable verbose logging.');
}


export interface ICommand {
  execute(): Promise<void>;
}

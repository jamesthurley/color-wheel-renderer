export interface ICommandOptionsProcessor<TUnprocessedOptions, TOptions> {
  process(unprocessed: TUnprocessedOptions): TOptions | undefined;
}

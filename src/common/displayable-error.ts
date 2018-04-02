
export class DisplayableError extends Error {
  public readonly isDisplayable: boolean = true;

  constructor(message: string) {
    super(message);
  }
}

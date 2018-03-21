export class Log {
  public static debug(text: string) {
    console.log(text);
  }

  public static info(text: string) {
    console.log(text);
  }

  public static warn(text: string) {
    console.warn(text);
  }

  public static error(text: string, error: Error) {
    console.error(text);
    console.error(error);
  }
}


export class Pixel {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number) {
  }

  public toString() {
    return `${this.red},${this.blue},${this.green}`;
  }
}

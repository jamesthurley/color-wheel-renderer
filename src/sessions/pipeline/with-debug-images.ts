import { DebugImage } from './debug-image';

export class WithDebugImages<T> {
  constructor(
    public readonly value: T,
    public readonly debugImages: ReadonlyArray<DebugImage>) {
  }
}

import * as Jimp from 'jimp';
import { IRectangle } from '../../common/rectangle';

export interface ISnapshot {
  readonly photoRectangle: IRectangle;
  readonly historyItemRectangle: IRectangle;

  loadScreenshot(): Promise<Jimp>;
  loadPhoto(): Promise<Jimp>;
  loadHistoryItem(): Promise<Jimp>;
}

export class CachedSnapshot implements ISnapshot {
  constructor(
    private readonly screenshot: Jimp,
    public readonly photoRectangle: IRectangle,
    private readonly photo: Jimp,
    public readonly historyItemRectangle: IRectangle,
    private readonly historyItem: Jimp) {
  }

  public loadScreenshot(): Promise<Jimp> {
    return Promise.resolve(this.screenshot.clone());
  }

  public loadPhoto(): Promise<Jimp> {
    return Promise.resolve(this.photo.clone());
  }

  public loadHistoryItem(): Promise<Jimp> {
    return Promise.resolve(this.historyItem.clone());
  }
}

export class LazySnapshot implements ISnapshot {
  constructor(
    public readonly loadScreenshot: () => Promise<Jimp>,
    public readonly photoRectangle: IRectangle,
    public readonly loadPhoto: () => Promise<Jimp>,
    public readonly historyItemRectangle: IRectangle,
    public readonly loadHistoryItem: () => Promise<Jimp>) {
  }
}

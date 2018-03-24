import * as Jimp from 'jimp';
import { IRectangle } from '../common/rectangle';

export class Snapshot{
  constructor(
    public readonly screenshot: Jimp,
    public readonly photoRectangle: IRectangle,
    public readonly photo: Jimp,
    public readonly historyItemRectangle: IRectangle,
    public readonly historyItem: Jimp) {
    }
}

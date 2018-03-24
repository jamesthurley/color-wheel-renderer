import { SnapshotSourceBase } from "./snapshot-source-base";
import { LightroomWindowsSource, LightroomWindowsSourceKey } from "./lightroom-windows-source";
import { LightroomMacSource, LightroomMacSourceKey } from "./lightroom-mac-source";

const map = new Map<string, () => SnapshotSourceBase>();
map.set(LightroomMacSourceKey, () => new LightroomMacSource());
map.set(LightroomWindowsSourceKey, () => new LightroomWindowsSource());

export const SnapshotSourceFactoryMap: ReadonlyMap<string, () => SnapshotSourceBase> = map;


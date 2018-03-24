import { EditorBase } from "./editor-base";
import { LightroomWindowsEditor, LightroomWindowsEditorKey } from "./lightroom-windows-editor";
import { LightroomMacEditor, LightroomMacEditorKey } from "./lightroom-mac-editor";

const map = new Map<string, () => EditorBase>();
map.set(LightroomMacEditorKey, () => new LightroomMacEditor());
map.set(LightroomWindowsEditorKey, () => new LightroomWindowsEditor());

export const EditorFactoryMap: ReadonlyMap<string, () => EditorBase> = map;


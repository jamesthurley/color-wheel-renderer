import { SnapshotFolderUtilities } from './snapshot-folder-utilities';

export abstract class SessionSnapshotFolderReader {

  private folders: ReadonlyArray<string>;
  private folderIndex: number = 0;

  constructor(
    private readonly sourceFolder: string,
    private readonly snapshotFolderUtilities: SnapshotFolderUtilities) {
  }

  protected getNextFolder(): string | undefined {
    if (!this.folders) {
      this.folders = this.snapshotFolderUtilities.getOrderedSnapshotFolders(this.sourceFolder);
    }

    if (this.folderIndex >= this.folders.length) {
      return undefined;
    }

    const nextFolder = this.folders[this.folderIndex];
    ++this.folderIndex;

    return nextFolder;
  }
}

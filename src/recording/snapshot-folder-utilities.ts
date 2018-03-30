import { padStart } from '../common/pad-start';
import { normalizeAndCreateFolder } from '../common/normalize-and-create-folder';
import * as fs from 'fs';
import { join } from 'path';

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string) => fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory);

export class SnapshotFolderUtilities {
  public getSnapshotFolderName(snapshotNumber: number): string {
    return 'snapshot-' + padStart(snapshotNumber, 4);
  }

  public getSnapshotFolderPath(sessionPath: string, snapshotNumber: number): string {
    return normalizeAndCreateFolder(join(sessionPath, this.getSnapshotFolderName(snapshotNumber)));
  }

  public getOrderedSnapshotFolders(sessionPath: string): string[] {
    const directories = getDirectories(sessionPath);
    directories.sort();
    return directories;
  }
}

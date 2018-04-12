import { padStart } from '../common/pad-start';
import { normalizeAndCreateFolder } from '../common/normalize-and-create-folder';
import * as fs from 'fs';
import { join } from 'path';

const isDirectory = (source: string) => fs.lstatSync(source).isDirectory();
const getDirectories = (source: string, folderPrefix?: string) => fs.readdirSync(source)
  .filter(name => folderPrefix ? name.startsWith(folderPrefix) : true)
  .map(name => join(source, name))
  .filter(isDirectory);

export class NumberedFolderUtilitiesBase {

  constructor(protected readonly folderPrefix: string) {
  }

  public getFolderName(folderNumber: number): string {
    return this.folderPrefix + padStart(folderNumber, 4);
  }

  public getFolderPath(sessionPath: string, folderNumber: number): string {
    return normalizeAndCreateFolder(join(sessionPath, this.getFolderName(folderNumber)));
  }

  public getOrderedFolders(sessionPath: string): string[] {
    const directories = getDirectories(sessionPath, this.folderPrefix);
    directories.sort();
    return directories;
  }
}

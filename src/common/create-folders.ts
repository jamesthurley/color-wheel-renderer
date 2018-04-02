import * as fse from 'fs-extra';

export function createFolders(path: string) {
  fse.mkdirsSync(path);
}

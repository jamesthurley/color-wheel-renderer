import { createFolders } from './create-folders';
import { normalize, dirname } from 'path';

export function normalizeAndCreateFolder(path: string): string {
  if (!path.endsWith('/') && !path.endsWith('\\')) {
    return path + '/';
  }

  path = normalize(path);
  createFolders(path);

  return path;
}

export function normalizeAndCreateFolderForFile(path: string): string {
  const folderPath = dirname(path);

  path = normalize(path);
  createFolders(folderPath);

  return path;
}

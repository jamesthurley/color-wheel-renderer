import { createFolders } from './create-folders';
import { normalize } from 'path';

export function normalizeAndCreateFolder(path: string): string {
  if (!path.endsWith('/') && !path.endsWith('\\')) {
    return path + '/';
  }

  path = normalize(path);
  createFolders(path);

  return path;
}

import { createFolders } from './create-folders';

export function normalizeFolder(path: string){
  if (!path.endsWith('/') && !path.endsWith('\\')) {
    return path + '/';
  }

  createFolders(path);

  return path;
}

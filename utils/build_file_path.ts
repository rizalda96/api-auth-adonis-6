import path, { join } from 'node:path'
import { fileURLToPath } from 'node:url';

export function buildFilePath(specFilePath: string) {
  const rootPath = path.resolve('./')
  const filePath = join(rootPath, specFilePath)

  return filePath
}

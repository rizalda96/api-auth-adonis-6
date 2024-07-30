import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

/**
 * Loops through a folder and requires all JavaScript files
 * Searches sub-directories as well.
 *
 * @param {string} folder
 */
export function includeRouteFiles(folder: string): void {
  try {
    const items = fs.readdirSync(folder);

    items.forEach((item) => {
      const fullPath = path.join(folder, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        includeRouteFiles(path.join(folder, item)); // Updated for correct relative path
      } else if (stat.isFile() && path.extname(fullPath) === '.ts') {

        const fileUrl = pathToFileURL(fullPath).href.replace(path.extname(fullPath), '.js');
        console.log(fileUrl);
        import(fileUrl);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}


// export function includeRouteFiles(directory) {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   const normalizedPath = path.join(__dirname, directory);
//   console.log(__dirname);


//   fs.readdirSync(normalizedPath).forEach(file => {
//     require(path.join(normalizedPath, file));
//   });
// }

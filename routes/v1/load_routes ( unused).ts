import { join, dirname } from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';

export async function loadRoutes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const routesPath = join(__dirname, 'modules');
  const routeFiles = await readdir(routesPath);
  const routeFunctions = [];

  for (const file of routeFiles) {
    const routePath = pathToFileURL(join(routesPath, file)).href;
    const { default: route } = await import(routePath);
    if (typeof route === 'function') {
      routeFunctions.push(route);
    }
  }

  return routeFunctions;
}

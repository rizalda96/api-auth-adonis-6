import router from '@adonisjs/core/services/router';
import { loadRoutes } from './load_routes.js'; // Adjust the import based on your file structure

async function setupRoutes() {
  const routeFunctions = await loadRoutes();
  console.log('Setting up routes...'); // Debugging log

  router.group(() => {
    routeFunctions.forEach(routeFunction => {
      console.log('Calling route function...'); // Debugging log
      routeFunction();  // Call the route function
    });
  })
  .prefix('v1')
  .as('v1');

  console.log('Routes setup complete'); // Debugging log
}

setupRoutes();

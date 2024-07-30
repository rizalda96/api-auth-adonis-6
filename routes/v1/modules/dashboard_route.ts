/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import DashboardController from '#controllers/v1/dashboard/dashboard_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'


export default function dashboardRoutes() {
  router.group(() => {
    router.get('/search', [DashboardController, 'search']).as('search') // final name - v1.dashboard.search
  })
  .prefix('dashboard')
  .as('dashboard')
  .middleware(middleware.auth())
}


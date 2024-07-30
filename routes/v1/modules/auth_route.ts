/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/v1/auth/auth_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'


export default function authRoutes() {
  router.group(() => {
    router.post('/login', [AuthController, 'login']).as('login') // final name - v1.auth.login
    router.post('/register', [AuthController, 'register']).as('register')
    router.post('/refresh-token', [AuthController, 'refreshToken']).as('refresh-token')
    router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
  })
  .prefix('auth')
  .as('auth')
}


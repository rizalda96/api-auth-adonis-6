/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/v1/auth/auth_controller';
import '../routes/v1/index.js'


router.get('/', async () => {
  return {
    hello: 'world',
  }
})



import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {

  async search({request, response, auth}: HttpContext) {
    // console.log(auth.user) // User
    // console.log(auth.authenticatedViaGuard) // 'api'
    // console.log(auth.user!.currentAccessToken) // AccessToken

    const userLogin = auth.user
    return response.ok(userLogin)
  }

}

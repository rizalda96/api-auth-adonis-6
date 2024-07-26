import User from '#models/user'
import { registerValidator } from '#validators/auth'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    await request.validateUsing(registerValidator)

    const user = await User.create(request.all())
    const token = await User.accessTokens.create(user)

    const data = Object.assign(user, token);

    return response.created({
      success: true,
      message: 'Success Created User.',
      data
    })
  }

  async login({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const token = await auth.use('api').attempt(email, password)
    return token
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').logout()
  }
}

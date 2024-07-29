import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { ResponseJson } from '#interfaces/response.interface'
import ResponseBody from '#utils/response'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    await request.validateUsing(registerValidator)

    const user = await User.create(request.all())
    const tokens = await User.accessTokens.create(user)

    return response.created(
      new ResponseBody({
        message: 'user has been created.',
        data: {
          user,
          token: {
            type: 'bearer',
            value: tokens.value!.release(),
            expiresAt: tokens.expiresAt,
          }
        },
      })
    )
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const tokens = await User.accessTokens.create(user)

    return response.ok(
      new ResponseBody({
        message: 'success login to app.',
        data: {
          user,
          token: {
            type: 'bearer',
            value: tokens.value!.release(),
            expiresAt: tokens.expiresAt,
          }
        },
      })
    )
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').logout()
  }
}

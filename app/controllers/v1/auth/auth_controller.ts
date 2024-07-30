import User from '#models/user'
import { loginValidator, refreshTokenValidator, registerValidator } from '#validators/auth'
import auth from '@adonisjs/auth/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import { ResponseJson } from '#interfaces/response.interface'
import ResponseBody from '#utils/response'
import { JwtGuard } from '../../../auth/guards/jwt.js'

export default class AuthController {
  async register({ request, response, auth }: HttpContext) {
    await request.validateUsing(registerValidator)

    const user = await User.create(request.all())
    const token = await auth.use('jwt').generate(user)
    // const tokens = await User.accessTokens.create(user)

    return response.created(
      new ResponseBody({
        message: 'user has been created.',
        data: {
          user,
          token
          // : {
          //   type: 'bearer',
          //   value: tokens.value!.release(),
          //   expiresAt: tokens.expiresAt,
          // }
        },
      })
    )
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    // const tokens = await User.accessTokens.create(user)

    const token = await auth.use('jwt').generate(user)

    return response.ok(
      new ResponseBody({
        message: 'success login to app.',
        data: {
          user,
          token
          // token: {
          //   type: 'bearer',
          //   value: tokens.value!.release(),
          //   expiresAt: tokens.expiresAt,
          // }
        },
      })
    )
  }

  async refreshToken({ request, response, auth }: HttpContext) {
    const { refresh_token } = await request.validateUsing(refreshTokenValidator)

    const token = await auth.use('jwt').verifyRefreshToken(refresh_token)

    return response.ok(
      new ResponseBody({
        message: 'success regenerate token.',
        data: {
          type: token.type,
          token: token.token,
          refresh_token: token.refresh_token,
        },
      })
    )
  }

  // async logout({ auth }: HttpContext) {
  //   await auth.use('api').logout()
  // }
}

import { errors } from '@adonisjs/auth'
import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class AuthException extends Exception {
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(error.status).send({
        status: false,
        data: error.messages,
        message: 'Error Unauthorizrd Access'
      })
    }

    if (error instanceof errors.E_INVALID_CREDENTIALS) {
      return ctx.response.status(error.status).send({
        status: false,
        data: error.messages,
        message: 'Error Invalid Credentials'
      })
    }

    return super.handle(error, ctx)
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
    return super.report(error, ctx)
  }
}



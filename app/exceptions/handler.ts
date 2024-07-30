import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { errors as errorLimiter } from '@adonisjs/limiter'
import { errors as authErrors } from '@adonisjs/auth'
import AuthException from './auth_exception.js'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction
  protected renderStatusPages = app.inProduction

  // Logging exceptions
  protected context(ctx: HttpContext) {
    return {
      requestId: ctx.requestId,
      userId: ctx.auth.user?.id,
      ip: ctx.request.ip(),
    }
  }


  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errorLimiter.E_TOO_MANY_REQUESTS) {

      const message = error.getResponseMessage(ctx)
      const headers = error.getDefaultHeaders()

      Object.keys(headers).forEach((header) => {
        ctx.response.header(header, headers[header])
      })

      return ctx.response.status(error.status).send({
        success: false,
        data: null,
        message
      })
    }

    if (error instanceof errors.E_VALIDATION_ERROR) {
      ctx.response.status(422).send({
        status: false,
        data: error.messages,
        message: 'Error Validation'
      })
      return
    }

    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response.status(error.status).send({
        status: false,
        data: null,
        message: 'Error Unauthorized Access'
      })
    }

    if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
      return ctx.response.status(error.status).send({
        status: false,
        data: null,
        message: 'Error Invalid Credentials'
      })
    }

    if (!this.debug) {
      ctx.response.status(error.status).send({
        success: false,
        data: null,
        message: error.message
      })
      return
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    // ctx.logger.error({ err: error }, error.message)
    return super.report(error, ctx)
  }
}

import { errors } from '@vinejs/vine'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'


export default class ValidationErrorException extends ExceptionHandler {
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

  async handle(error: unknown, ctx: HttpContext) {

    if (error instanceof errors.E_VALIDATION_ERROR) {
      ctx.response.status(422).send({
        status: false,
        data: error.messages,
        message: 'Error Validation'
      })
      return
    }

    return super.handle(error, ctx)
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
    return super.report(error, ctx)
  }
}


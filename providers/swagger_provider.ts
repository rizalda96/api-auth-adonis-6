import type { ApplicationService } from '@adonisjs/core/types'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { buildFilePath } from '../utils/build_file_path.ts'
import { promises as fs } from 'node:fs'
import SwaggerController from '#controllers/swagger_controller'
import { SwaggerAuthMiddleware } from '#config/swagger/swagger_auth_middleware'

export default class SwaggerProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  async register(): Promise<void> {
    this.registerSwaggerManager()
    this.registerSwaggerAuthMiddleware()
  }

  /**
   * The container bindings have booted
   */
  async boot(): Promise<void> {
    const config = this.getSwaggerConfig()
    await this.generateSwagger(config)
    const router = await this.app.container.make('router')

    const controller = new SwaggerController(this.app, config)
    if (config.uiUrl ?? SwaggerController.DEFAULT_UI_ENABLED) {
      router
        .get(
          `${config.uiUrl ?? SwaggerController.DEFAULT_UI_ENABLED}/:fileName?`,
          controller.swaggerUI.bind(controller)
        )
        .middleware(config.middleware ?? SwaggerController.DEFAULT_MIDDLEWARE)
    }

    if (config.specEnabled ?? SwaggerController.DEFAULT_SPEC_ENABLED) {
      const middleware = await this.mergeAuthMiddleware(
        config.middleware ?? SwaggerController.DEFAULT_MIDDLEWARE
      )
      router.get(config.specUrl, controller.swaggerFile.bind(controller)).middleware(middleware)
    }
  }

  private registerSwaggerAuthMiddleware() {
    this.app.container.singleton('swagger.swagger_auth_middleware', async () => {
      const config = this.getSwaggerConfig()
      if (!config) {
        throw new RuntimeException('Invalid config exported from "config/swagger.ts" file.')
      }
      if (!config.swaggerAuth) {
        return null
      }
      return new SwaggerAuthMiddleware(config.swaggerAuth, new SwaggerAuthHeaderDecoder())
    })
  }

  private async mergeAuthMiddleware(
    middlewares: string[]
  ): Promise<OneOrMore<MiddlewareFn | ParsedNamedMiddleware>> {
    const config = this.getSwaggerConfig()
    return config.swaggerAuth?.authMiddleware
      ? middlewares.concat(config.swaggerAuth?.authMiddleware)
      : middlewares
  }

  private getSwaggerConfig() {
    return this.app.config.get('swagger')
  }

  private registerSwaggerManager() {
    this.app.container.singleton('swagger.manager', async () => {
      const config = this.getSwaggerConfig()
      if (!config) {
        throw new RuntimeException('Invalid config exported from "config/swagger.ts" file.')
      }
      return config
    })
  }

    private async generateSwagger(_config = null): Promise<void> {
    const config = _config ?? this.getSwaggerConfig()

    const swaggerFileContent = swaggerJSDoc(config.options)

    if (!config.specFilePath) {
      throw new Error(
        "Config option 'swagger.specFilePath' should be specified for using this command"
      )
    }

    const filePath = buildFilePath(config.specFilePath)
    await fs.writeFile(filePath, JSON.stringify(swaggerFileContent))
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import * as swaggerUiDist from 'swagger-ui-dist'
import { promises as fsp, ReadStream } from 'node:fs'
import mime from 'mime'
import { join } from 'node:path'
import * as fs from 'node:fs'
import { buildJsDocConfig } from '#utils/build_js_doc_config'
import { buildFilePath } from '#utils/build_file_path'
import swaggerJSDoc from 'swagger-jsdoc'

export default class SwaggerController {

  static DEFAULT_UI_URL = '/docs'
  static DEFAULT_SWAGGER_MODE = 'RUNTIME'
  static DEFAULT_OPTIONS = {}
  static DEFAULT_SPEC_FILE_PATH = 'docs/swagger.json'
  static DEFAULT_UI_ENABLED = true
  static DEFAULT_MIDDLEWARE = []
  static DEFAULT_SPEC_ENABLED = true

  constructor(
    private app: ApplicationService,
    private config
  ) {}

  async swaggerUI({ params, response }: HttpContext) {
    const swaggerUiAssetPath = this.config.swaggerUiDistPath || swaggerUiDist.getAbsoluteFSPath()
    if (!params.fileName) {
      const baseUrl = (this.config.uiUrl ?? this.DEFAULT_UI_URL).replace('/', '')
      return response.redirect(`/${baseUrl}/index.html`)
    }

    const fileName = params.fileName ? params.fileName : 'index.html'
    const path = join(swaggerUiAssetPath, fileName)
    const contentType = mime.getType(path)

    if (fileName.includes('initializer')) {
      const initializer = await fsp.readFile(path, 'utf-8')
      return response
        .header('Content-Type', contentType ?? '')
        .send(
          initializer.replace('https://petstore.swagger.io/v2/swagger.json', this.config.specUrl)
        )
    }
    return response.header('Content-Type', contentType ?? '').stream(fs.createReadStream(path))
  }

  async swaggerFile({ response }: HttpContext): Promise<void> {
    const mode = this.config.mode ?? this.DEFAULT_SWAGGER_MODE
    if (mode === 'RUNTIME') {
      return response.send(
        swaggerJSDoc(buildJsDocConfig(this.config.options ?? this.DEFAULT_OPTIONS))
      )
    }
    return response
      .safeHeader('Content-type', 'application/json')
      .notAcceptable()
  }

  protected getSwaggerSpecFileContent(): ReadStream {
    // @ts-ignore dont understand wht it still can be undefined
    const specFilePath: string = this.config.specFilePath ?? this.DEFAULT_SPEC_FILE_PATH

    const filePath = buildFilePath(specFilePath)
    return fs.createReadStream(filePath)
  }

}

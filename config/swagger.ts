import env from '#start/env'
import { SwaggerConfig } from 'adonisjs-6-swagger'

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Application with swagger docs',
        version: '1.0.0',
        description: 'My application with swagger docs',
      },
      servers: [
        {
          url: `http://${env.get('HOST')}:${env.get('PORT')}`,
          description: env.get('NODE_ENV'),
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            in: 'header',
            name: 'Authorization',
          }
        }
      }
    },
    apis: [
      'docs/**/*.yml',
    ],
    basePath: '/',
  },
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
} as SwaggerConfig

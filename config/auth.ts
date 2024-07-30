import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

import { sessionUserProvider } from '@adonisjs/auth/session'
import env from '#start/env'
import { JwtGuard } from '../app/auth/guards/jwt.js'

const jwtConfig = {
  secret: env.get('APP_KEY'),
  refresh_token_secret: env.get('REFRESH_TOKEN_KEY'),
}
const userProvider = sessionUserProvider({
  model: () => import('#models/user'),
})


const authConfig = defineConfig({

  default: 'jwt',
  guards: {
    jwt: (ctx) => {
      return new JwtGuard(ctx, userProvider, jwtConfig)
    },
  },


  // // ini default guard by adonis js 6
  // default: 'api',
  // guards: {
  //   api: tokensGuard({
  //     provider: tokensUserProvider({
  //       tokens: 'accessTokens',
  //       model: () => import('#models/user')
  //     }),
  //   }),
  // },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}

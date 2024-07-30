import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import env from '#start/env'
import { JwtGuard } from '../auth/guards/jwt.js'
import AccessToken from './access_token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // static accessTokens = DbAccessTokensProvider.forModel(User, {
  //   expiresIn: '5 minutes',
  //   // prefix: 'oat_',
  //   // table: 'auth_access_tokens',
  //   // type: 'auth_token',
  //   // tokenSecretLength: 40,
  // })

  @hasMany(() => AccessToken, {
    foreignKey: 'tokenable_id', // defaults to userId
  })
  declare access_tokens: HasMany<typeof AccessToken>
}

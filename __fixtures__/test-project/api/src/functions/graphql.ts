import { createAuthDecoder as createDbAuthDecoder } from '@cedarjs/auth-dbauth-api'
import { authDecoder as netlifyAuthDecoder } from '@cedarjs/auth-netlify-api'
import { authDecoder as supabaseAuthDecoder } from '@cedarjs/auth-supabase-api'
import { createGraphQLHandler } from '@cedarjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { cookieName, getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const dbAuthDecoder = createDbAuthDecoder(cookieName)

export const handler = createGraphQLHandler({
  authDecoder: [dbAuthDecoder, supabaseAuthDecoder, netlifyAuthDecoder],
  getCurrentUser,
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
  openTelemetryOptions: {
    resolvers: true,
    result: true,
    variables: true,
  },
})

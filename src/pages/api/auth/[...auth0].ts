// pages/api/auth/[...auth0].js
import { handleAuth } from '@auth0/nextjs-auth0'
import { auth0LoginHandler } from '@/pages/api/auth/handlers/login'
import { auth0CallbackHandler } from '@/pages/api/auth/handlers/callback'

export default handleAuth({
  login: auth0LoginHandler,
  callback: auth0CallbackHandler,
})

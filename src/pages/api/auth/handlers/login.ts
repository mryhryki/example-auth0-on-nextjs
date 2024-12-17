import { filterString } from '@/utils/string'
import { handleLogin } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

export const auth0LoginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = filterString(req.query.method)

  if (method === 'HRD') {
    await handleLogin(req, res)
    return
  }

  // Ref: https://github.com/auth0/nextjs-auth0/issues/701#issuecomment-1255350171
  const invitation = filterString(req.query.invitation);
  const organizationByQuery = filterString(req.query.organization)
  const connectionByQuery = filterString(req.query.connection)

  // https://nextjs.org/docs/pages/api-reference/functions/next-request#cookies
  const organizationByCookie = filterString(req.cookies['auth0-organization'])
  const connectionByCookie = filterString(req.cookies['auth0-connection'])

  if (organizationByQuery == null &&
      connectionByQuery == null &&
      organizationByCookie != null) {
    return res.redirect(
      307,
      `/select_login_method?organization=${organizationByCookie}&connection=${connectionByCookie}`,
    )
  }

  await handleLogin(req, res, {
    authorizationParams: {
      invitation: invitation ?? undefined,
      organization: organizationByQuery ?? undefined,
      connection: (organizationByQuery != null || invitation != null) ?
        undefined :
        connectionByQuery ?? 'Username-Password-Authentication',
    },
  });
};


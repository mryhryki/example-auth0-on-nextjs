import { getAccessToken, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'

interface AccessInfoPageProps {
  user: {
    email: string
    email_verified: boolean
    sid: string
    sub: string
  }
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
  accessToken: {
    hash: string;
    scope: string;
    expiresAt: number;
  }
}

export default function AccessInfoPage(props: AccessInfoPageProps) {
  const { user, organization, accessToken } = props

  return (
    <>
      <section>
        <h2>User info</h2>
        <ul>
          <li>Email: <strong>{user.email}</strong></li>
          <li>Email verified: <strong>{user.email_verified.toString()}</strong></li>
          <li>SID: <strong>{user.sid}</strong></li>
          <li>Sub: <strong>{user.sub}</strong></li>
        </ul>
      </section>
      <section>
        <h2>Organization</h2>
        <ul>
          <li>ID: <strong>{organization.id}</strong></li>
          <li>Name: <strong>{organization.name}</strong>
            <ul>
              <li>Login URL: <a href={`/api/auth/login?organization=${organization.id}`}>Login</a></li>
            </ul>
          </li>
          <li>Display name: <strong>{organization.displayName}</strong></li>
          <li>Enable SSO: <strong>{organization.enableSSO ? 'true' : 'false'}</strong></li>
        </ul>
      </section>
      <section>
        <h2>Access Token</h2>
        <ul>
        <li>Hash: <strong>{accessToken.hash}</strong></li>
          <li>Scope: <strong>{accessToken.scope}</strong></li>
          <li>Expires: <strong>{new Date(accessToken.expiresAt * 1000).toISOString()}</strong></li>
        </ul>
      </section>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx.req, ctx.res)
    // console.debug('Session:', JSON.stringify(session, null, 2))
    const { user, accessTokenScope, accessTokenExpiresAt } = session ?? {}

    const accessToken: string = (await getAccessToken(ctx.req, ctx.res, { refresh: false })).accessToken ?? ''
    // console.debug('Access token:', accessToken)

    const accessTokenHash = Buffer.from(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(accessToken)),
    ).toString('hex')

    const props: AccessInfoPageProps = {
      user: {
        email: user?.email ?? '(No email)',
        email_verified: user?.email_verified ?? false,
        sid: user?.sid ?? '(No sid)',
        sub: user?.sub ?? '(No sub)',
      },
      organization: {
        id: user?.org_id ?? '(No org_id)',
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO: user?.orgEnableSSO ?? false,
      },
      accessToken: {
        hash: accessTokenHash,
        scope: accessTokenScope ?? "(No scope)",
        expiresAt: accessTokenExpiresAt ?? 0,
      }
    }

    return { props }
  },
})


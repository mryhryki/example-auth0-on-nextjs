import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/session'

export default function AccessInfoPage(props: Auth0Session) {
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
          <li>ID: <strong>{organization.orgId}</strong></li>
          <li>Name: <strong>{organization.orgName}</strong>
            <ul>
              <li>Login URL: <a href={`/api/auth/login?organization=${organization.orgId}`}>Login</a></li>
            </ul>
          </li>
          <li>Display name: <strong>{organization.displayName}</strong></li>
          <li>Enable SSO: <strong>{organization.enableSSO ? 'true' : 'false'}</strong></li>
        </ul>
      </section>
      <section>
        <h2>Access Token</h2>
        <ul>
        <li>Hash: <strong>{accessToken.accessTokenHash}</strong></li>
          <li>Scope: <strong>{accessToken.accessTokenScope}</strong></li>
          <li>Expires: <strong>{new Date(accessToken.accessTokenExpiresAt * 1000).toISOString()}</strong></li>
        </ul>
      </section>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsForSession,
})


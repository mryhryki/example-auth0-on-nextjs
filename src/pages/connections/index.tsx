import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/auth0/session'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'

export default function SsoConfigurationIndexPage(props: Auth0Session) {
  const { organization } = props
  const { orgId, displayName, enableSSO } = organization

  const baseUrl = `/api/auth/login?organization=${orgId}`
  const { loading, updating, connectionsByOrganizationMetadata, updateOrganizationMetadata } = useOrganization()

  return (
    <section>
      <h1>Connections</h1>
      {(() => {
        if (!enableSSO) {
          return (
            <p>
              <strong>{displayName}</strong> (Name: <strong>{organization.orgName}</strong>) organization is not enabled SSO.
            </p>
          )
        }
        if (loading) {
          return (
            <>
              <Link href="/connections/new">Add new connection</Link>
              <Loading />
            </>
          )
        }
        return (
          <>
            <Link href="/connections/new">Add new connection</Link>
            <ol>
              {connectionsByOrganizationMetadata.map((connection) => {
                const { connectionId, displayName, name, enabled, isDatabaseConnection } = connection
                const loginUrl = `${baseUrl}&connection=${name}`
                return (
                  <li key={connectionId}>
                    <strong>{displayName}</strong>
                    <ul>
                      <li>ID: <strong>{connectionId}</strong></li>
                      <li>Login URL:{' '}
                        <Link
                          href={loginUrl}
                          style={{ textDecorationLine: enabled ? undefined : 'line-through' }}
                        >
                          {loginUrl}
                        </Link>
                      </li>
                      <li>
                        Database connection: <strong>{isDatabaseConnection ? 'Yes' : 'No'}</strong>
                      </li>
                      <li>
                        Enabled: <strong>{enabled ? 'Yes' : 'No'}</strong>
                        <button
                          onClick={() => updateOrganizationMetadata({
                            [connectionId]: JSON.stringify({
                              displayName,
                              name,
                              enabled: !enabled,
                            }),
                          })}
                          disabled={updating}
                        >
                          → {enabled ? 'Disable' : 'Enable'}
                        </button>
                      </li>
                    </ul>
                  </li>
                )
              })}
            </ol>
          </>
        )
      })()}
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsForSession,
})


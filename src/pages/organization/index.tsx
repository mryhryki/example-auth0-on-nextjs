import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'

export default function SsoConfigurationIndexPage() {
  const {
    loading,
    updating,
    organization,
    connectionsByOrganizationMetadata,
    updateOrganizationMetadata,
  } = useOrganization()
  const enableSSO: boolean = organization?.metadata.enableSSO === 'true'
  const baseUrl = `/api/auth/login?organization=${organization?.id ?? ''}`

  return (
    <section>
      <h1>Organization</h1>
      {loading || organization == null ? (<Loading />) : (
        <>
          <section>
            <h2>Organization Info</h2>
            <ul>
              <li>ID:<strong>{organization.id}</strong></li>
              <li>Name:<strong>{organization.name}</strong></li>
              <li>Display name:<strong>{organization.display_name}</strong></li>
              <li>
                SSO:<strong>{enableSSO ? 'Enabled' : 'Disabled'}</strong>
                <button
                  onClick={() => updateOrganizationMetadata({ enableSSO: enableSSO ? 'false' : 'true' })}
                  disabled={updating}
                >
                  → {enableSSO ? 'Disable' : 'Enable'}
                </button>
              </li>
            </ul>
          </section>
          <section>
            <h2>Connection</h2>
            <Link href="/organization/new_connection">Add new connection</Link>
            <ol>
              {connectionsByOrganizationMetadata.map((connection) => {
                const { connectionId, displayName, name, enabled, isDatabaseConnection } = connection
                const loginUrl = `${baseUrl}&connection=${name}`
                return (
                  <li key={connectionId}>
                    <strong>{displayName}</strong>
                    <ul>
                      <li>ID:<strong>{connectionId}</strong></li>
                      <li>Login URL:{' '}
                        <Link
                          href={loginUrl}
                          style={{ textDecorationLine: enabled ? undefined : 'line-through' }}
                        >
                          {loginUrl}
                        </Link>
                      </li>
                      <li>
                        Database connection:<strong>{isDatabaseConnection ? 'Yes' : 'No'}</strong>
                      </li>
                      <li>
                        Enabled:<strong>{enabled ? 'Yes' : 'No'}</strong>
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
          </section>
        </>
      )}
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})


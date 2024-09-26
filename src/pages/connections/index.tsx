import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/session'
import { useOrganizationConnections } from '@/hooks/useOrganizationConnections'
import { Loading } from '@/components/loading/Loading'

export default function SsoConfigurationIndexPage(props: Auth0Session) {
  const { organization } = props
  const { orgId, orgIdWithoutPrefix, displayName, enableSSO } = organization

  const baseUrl = `/api/auth/login?organization=${orgId}`
  const { connections, loading } = useOrganizationConnections()

  return (
    <section>
      <h1>SSO Configurations</h1>
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
              <Link href="/connections/new">Add new configuration</Link>
              <Loading />
            </>
          )
        }
        return (
          <>
            <Link href="/connections/new">Add new configuration</Link>
            <ol>
              {connections.map((connection) => {
                const { connection_id: id, connection: { name, strategy } } = connection
                const nameWithoutPrefix = name.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '')
                const loginUrl = `${baseUrl}&connection=${name}`
                return (
                  <li key={id}>
                    <strong>{nameWithoutPrefix}</strong>
                    <ul>
                      <li>Strategy: <strong>{strategy}</strong></li>
                      <li>Login URL: <Link href={loginUrl}>{loginUrl}</Link></li>
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


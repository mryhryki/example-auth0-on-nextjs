import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/session'
import { useOrganizationConnections } from '@/hooks/useOrganizationConnections'
import { Loading } from '@/components/loading/Loading'

export default function SsoConfigurationIndexPage(props: Auth0Session) {
  const { organization } = props
  const { orgIdWithoutPrefix, displayName, enableSSO } = organization

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
              <Link href="/sso_configurations/new">Add new configuration</Link>
              <Loading />
            </>
          )
        }
        return (
          <>
            <Link href="/sso_configurations/new">Add new configuration</Link>
            <ol>
              {connections.map((connection) => {
                const { connection_id: id, connection: { name, strategy } } = connection
                return (
                  <li key={id}>
                    <Link href={`/sso_configurations/${id}`}>{strategy}: {name.replace(
                      new RegExp(`^${orgIdWithoutPrefix}-`),
                      '',
                    )}</Link>
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


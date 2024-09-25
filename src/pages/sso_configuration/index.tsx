import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'
import Link from 'next/link'

interface OrganizationConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: {
    name: string;
    strategy: string;
  };
}

interface SsoConfigurationIndexPageProps {
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
  connections: OrganizationConnection[]
}

export default function SsoConfigurationIndexPage(props: SsoConfigurationIndexPageProps) {
  const { organization, connections } = props
  const { displayName, enableSSO } = organization
  const orgIdWithoutPrefix = organization.id.substring('org_'.length)

  return (
    <section>
      <h1>SSO Configurations</h1>
      {enableSSO ? (
        <>
          <ol>
            {connections.map((connection) => {
              const { connection_id: id, connection: { name, strategy } } = connection
              return (
                <li key={id}>
                  <Link href={`/sso_configuration/${id}`}>{strategy}: {name.replace(
                    new RegExp(`^${orgIdWithoutPrefix}-`),
                    '',
                  )}</Link>
                </li>
              )
            })}
          </ol>
          <Link href="/sso_configuration/new">Add new configuration</Link>
        </>
      ) : (
        <p>
          <strong>{displayName}</strong> (Name: <strong>{organization.name}</strong>) organization is not enabled SSO.
        </p>
      )}
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx.req, ctx.res)
    // console.debug('Session:', JSON.stringify(session, null, 2))
    const { user } = session ?? {}

    const orgId = user?.org_id ?? '(No org_id)'
    const enableSSO = user?.orgEnableSSO ?? false

    const { data } = await auth0ManagementClient.organizations.getEnabledConnections({
      id: orgId,
      page: 0,
      per_page: 100,
      include_totals: true,
    })

    const props: SsoConfigurationIndexPageProps = {
      organization: {
        id: orgId,
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO,
      },
      connections: data.enabled_connections,
    }
    return { props }
  },
})


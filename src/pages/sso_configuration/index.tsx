import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0/client'
import Link from 'next/link'
import { Auth0OrganizationInfo, getAuth0Session } from '@/utils/session'

interface OrganizationConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: {
    name: string;
    strategy: string;
  };
}

interface SsoConfigurationIndexPageProps {
  organization: Auth0OrganizationInfo
  connections: OrganizationConnection[]
}

export default function SsoConfigurationIndexPage(props: SsoConfigurationIndexPageProps) {
  const { organization, connections } = props
  const { orgIdWithoutPrefix, displayName, enableSSO } = organization

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
          <strong>{displayName}</strong> (Name: <strong>{organization.orgName}</strong>) organization is not enabled SSO.
        </p>
      )}
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getAuth0Session(ctx.req, ctx.res)

    const { data } = await auth0ManagementClient.organizations.getEnabledConnections({
      id: session.organization.orgId,
      page: 0,
      per_page: 100,
      include_totals: true,
    })

    const props: SsoConfigurationIndexPageProps = {
      organization: session.organization,
      connections: data.enabled_connections,
    }
    return { props }
  },
})


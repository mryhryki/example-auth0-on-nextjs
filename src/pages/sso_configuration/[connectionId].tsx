import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'

interface OrganizationConnection {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: {
    name: string;
    strategy: string;
  };
}

interface SsoPageProps {
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
  connection: OrganizationConnection
}

export default function SsoConfigurationPage(props: SsoPageProps) {
  const { organization, connection } = props
  const orgIdWithoutPrefix = organization.id.substring('org_'.length)
  const connectionName = connection.connection.name.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '')

  return (
    <section>
      <h1>SSO Configuration</h1>
      <section>
        <ul>
          <li>ID: <strong>{connection.connection_id}</strong></li>
          <li>Name: <strong>{connectionName}</strong></li>
          <li>Strategy: <strong>{connection.connection.strategy}</strong></li>
        </ul>
      </section>
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

    if (!enableSSO) {
      throw new Error('SSO is not enabled for this organization')
    }

    const { data } = await auth0ManagementClient.organizations.getEnabledConnection({
      id: orgId,
      connectionId: ctx.params?.connectionId as string,
    })

    const props: SsoPageProps = {
      organization: {
        id: orgId,
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO,
      },
      connection: data,
    }
    return { props }
  },
})


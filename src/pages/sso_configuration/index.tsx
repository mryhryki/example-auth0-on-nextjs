import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'
import { OrganizationConnection } from 'auth0'

interface SsoPageProps {
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
  connections: OrganizationConnection[]
}

export default function SsoPage(props: SsoPageProps) {
  const { organization, connections } = props
  const { id, displayName, enableSSO } = organization

  return (
    <section>
      <h1>SSO Configuration</h1>
      {enableSSO ? (
        <ol>
          {connections.map((connection) => {
            const { connection_id: id, connection: { name, strategy } } = connection
            return (
              <li key={id}>
                <strong>{strategy}: {name}</strong> (ID: <strong>{id}</strong>)
              </li>
            )
          })}
        </ol>
      ) : (
        <p>
          <strong>{displayName}</strong> (ID: <strong>{id}</strong>) organization is not enabled SSO.
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

    const props: SsoPageProps = {
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


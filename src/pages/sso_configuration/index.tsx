import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'

interface SsoPageProps {
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
}

export default function SsoPage(props: SsoPageProps) {
  const { id, displayName, enableSSO } = props.organization

  return (
    <section>
      <h1>SSO Configuration</h1>
      {enableSSO ? (
        <section>TODO</section>
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

    const connections = await auth0ManagementClient.organizations.getEnabledConnections({
      id: orgId,
      page: 0,
      per_page: 100,
      include_totals: true,
    })
    console.debug('#####', JSON.stringify({ connections }, null, 2));

    const props: SsoPageProps = {
      organization: {
        id: orgId,
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO,
      },
    }
    return { props }
  },
})


import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'

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
    const { user, accessTokenScope, accessTokenExpiresAt } = session ?? {}

    const props: SsoPageProps = {
      organization: {
        id: user?.org_id ?? '(No org_id)',
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO: user?.orgEnableSSO ?? false,
      },
    }
    return { props }
  },
})


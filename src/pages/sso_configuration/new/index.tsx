import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'
import { useEffect } from 'react'

interface SsoConfigurationNewPageProps {
  organization: {
    id: string
    name: string
    displayName: string
    enableSSO: boolean
  }
}

export default function SsoPage(props: SsoConfigurationNewPageProps) {
  const { organization } = props
  const { displayName, name } = organization

  return (
    <section>
      <h1>Create NEW SSO Configuration for <strong>{displayName}</strong> (Name: <strong>{name}</strong>)</h1>
      <form>
        <label>
          <div>Type</div>
          <select>
            <option value="saml">SAML</option>
          </select>
        </label>
        <label>
          <div>Name</div>
          <input type="text" />
        </label>
        <label>
          <div>Sign In URL</div>
          <input type="text" />
        </label>
        <label>
          <div>X509 Signing Certificate</div>
          <input type="file" />
        </label>
        <label>
          <div>Sign Out URL (Optional)</div>
          <input type="text" />
        </label>
      </form>
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

    const props: SsoConfigurationNewPageProps = {
      organization: {
        id: orgId,
        name: user?.org_name ?? '(No org_name)',
        displayName: user?.orgDisplayName ?? '(No orgDisplayName)',
        enableSSO,
      },
    }

    return {
      props,
      redirect: enableSSO ? undefined : {
        permanent: false,
        destination: "/access_info",
      }
    }
  },
})


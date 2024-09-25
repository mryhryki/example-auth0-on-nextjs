import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { Messages } from '@/components/message/Messages'
import { useCreateNewSsoConfiguration } from '@/hooks/useCreateNewSsoConfiguration'
import { useMessages } from '@/hooks/useMessages'

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

  const { errorMessages, removeMessage, addMessage } = useMessages()
  const { values, setValues, canSubmit, onSubmit } = useCreateNewSsoConfiguration({ addMessage })

  return (
    <section>
      <h1>Create NEW SSO Configuration for <strong>{displayName}</strong> (Name: <strong>{name}</strong>)</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Type</div>
          <select
            value={values.type}
            onChange={(event) => setValues((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="samlp">SAML</option>
          </select>
        </label>
        <label>
          <div>Name {'(Pattern: "^[a-zA-Z0-9](-[a-zA-Z0-9]|[a-zA-Z0-9])*")'}</div>
          <input
            type="text"
            value={values.name}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label>
          <div>Sign In URL</div>
          <input
            type="text"
            value={values.signInUrl}
            onChange={(event) => setValues((prev) => ({ ...prev, signInUrl: event.target.value }))}
          />
        </label>
        <label>
          <div>X509 Signing Certificate</div>
          <input
            type="file"
            onChange={(event) => setValues((prev) => ({ ...prev, x509SigningCert: event.target.files?.[0] ?? null }))}
          />
        </label>
        <input type="submit" value="Create" disabled={!canSubmit} />
      </form>
      <Messages errorMessages={errorMessages} removeMessage={removeMessage} />
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


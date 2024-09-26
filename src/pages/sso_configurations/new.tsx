import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { Messages } from '@/components/message/Messages'
import { useCreateNewSsoConfiguration } from '@/hooks/useCreateNewSsoConfiguration'
import { useMessages } from '@/hooks/useMessages'
import { Auth0Session, getAuth0Session } from '@/utils/session'

export default function SsoConfigurationsNewPage(props: Auth0Session) {
  const { organization } = props
  const { displayName, orgName } = organization

  const { errorMessages, removeMessage, addMessage } = useMessages()
  const { values, setValues, canSubmit, onSubmit } = useCreateNewSsoConfiguration({ addMessage })

  return (
    <section>
      <h1>Create NEW SSO Configuration for <strong>{displayName}</strong> (Name: <strong>{orgName}</strong>)</h1>
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
  getServerSideProps: async (ctx: GetServerSidePropsContext) => {
    const session = await getAuth0Session(ctx.req, ctx.res)
    return {
      props: session,
      redirect: session.organization.enableSSO ? undefined : {
        permanent: false,
        destination: "/access_info",
      }
    }
  },
})


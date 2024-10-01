import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useCreateNewSsoConfiguration } from '@/hooks/useCreateNewSsoConfiguration'

export default function OrganizationNewConnectionPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewSsoConfiguration()

  return (
    <section>
      <h1>Create NEW SSO Connection</h1>
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
          <div>Display Name (Max: 30 characters)</div>
          <input
            type="text"
            value={values.displayName}
            onChange={(event) => setValues((prev) => ({ ...prev, displayName: event.target.value }))}
            maxLength={30}
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
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})


import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'

export default function UsersNewPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation()
  const { loading, connectionsByOrganizationMetadata } = useOrganization()

  return (
    <section>
      <h1>Create an Invitation</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Connection</div>
          {loading ? <Loading /> : (
            <select
              value={values.connectionId}
              onChange={(event) => setValues((prev) => ({ ...prev, connectionId: event.target.value }))}
            >
              {connectionsByOrganizationMetadata.map((connection) => (
                <option
                  key={connection.connectionId}
                  value={connection.connectionId}
                >
                  {connection.displayName}
                </option>
              ))}
            </select>
          )}
        </label>
        <label>
          <div>Email</div>
          <input
            type="text"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <input type="submit" value="Create" disabled={!canSubmit} />
      </form>
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})


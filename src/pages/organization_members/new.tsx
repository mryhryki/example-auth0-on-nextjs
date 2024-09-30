import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'
import { useEffect } from 'react'
import { useCreateNewUser } from '@/hooks/useCreateNewUser'

export default function UsersNewPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewUser()
  const { loading, connectionsByOrganizationMetadata } = useOrganization()

  useEffect(() => {
    if (connectionsByOrganizationMetadata.length === 0) return
    setValues((prev) => ({ ...prev, connectionId: connectionsByOrganizationMetadata[0].connectionId }))
  }, [connectionsByOrganizationMetadata, setValues])

  return (
    <section>
      <h1>Create a User</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Connection</div>
          {loading ? <Loading /> : (
            <select
              value={values.connectionId}
              onChange={(event) => setValues((prev) => ({ ...prev, connectionId: event.target.value }))}
            >
              {connectionsByOrganizationMetadata
                .filter(({ isDatabaseConnection }) => isDatabaseConnection)
                .map((connection) => (
                <option
                  key={connection.connectionId}
                  value={connection.connectionId}
                >
                  {connection.displayName}
                </option>
                ))
              }
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


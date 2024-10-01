import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'
import { useEffect, useMemo } from 'react'
import { useCreateNewUser } from '@/hooks/useCreateNewUser'

export default function UsersNewPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewUser()
  const { loading, connectionsByOrganizationMetadata } = useOrganization()
  const validConnection = useMemo(
    () => connectionsByOrganizationMetadata.filter(({ isDatabaseConnection }) => isDatabaseConnection),
    [connectionsByOrganizationMetadata],
  )

  useEffect(() => {
    if (validConnection.length === 0) return
    setValues((prev) => ({ ...prev, connectionName: validConnection[0].name }))
  }, [validConnection, setValues])

  return (
    <section>
      <h1>Create a User</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Connection</div>
          {loading ? <Loading /> : (
            <select
              value={values.connectionName}
              onChange={(event) => setValues((prev) => ({ ...prev, connectionName: event.target.value }))}
            >
              {validConnection.map((connection) => (
                <option
                  key={connection.connectionId}
                  value={connection.name}
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
        <label>
          <input
            type="checkbox"
            checked={values.emailVerified}
            onChange={(event) => setValues((prev) => ({ ...prev, emailVerified: event.target.checked }))}
          />
          Email Verified (Email will not be sent)
        </label>
        <input type="submit" value="Create" disabled={!canSubmit} />
      </form>
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})


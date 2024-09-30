import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'
import { useEffect, useMemo } from 'react'

export default function UsersNewPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation()
  const { loading, connectionsByOrganizationMetadata } = useOrganization()
  const validConnection = useMemo(
    () => connectionsByOrganizationMetadata.filter(({ isDatabaseConnection }) => !isDatabaseConnection),
    [connectionsByOrganizationMetadata],
  )

  useEffect(() => {
    if (validConnection.length === 0) return
    setValues((prev) => ({ ...prev, connectionId: validConnection[0].connectionId }))
  }, [validConnection, setValues])

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
              {validConnection.map((connection) => (
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


import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'
import { Loading } from '@/components/loading/Loading'
import { useOrganization } from '@/hooks/useOrganization'
import { useEffect, useMemo } from 'react'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'

export default function UsersNewPage() {
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation()

  const { loading: loadingOrganization, connectionsByOrganizationMetadata } = useOrganization()
  const validConnection = useMemo(
    () => connectionsByOrganizationMetadata.filter(({ isDatabaseConnection }) => !isDatabaseConnection),
    [connectionsByOrganizationMetadata],
  )
  useEffect(() => {
    if (validConnection.length === 0) return
    setValues((prev) => ({ ...prev, connectionId: validConnection[0].connectionId }))
  }, [validConnection, setValues])

  const { loading: loadingOrganizationMembers, members } = useOrganizationMembers()
  const validMembers = useMemo(() => members.filter((member) => member.user_id?.startsWith('auth0|')), [members])
  useEffect(() => {
    if (validMembers.length === 0) return
    setValues((prev) => ({ ...prev, userId: validMembers[0].user_id ?? '' }))
  }, [validMembers, setValues])

  return (
    <section>
      <h1>Create an Invitation</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Connection</div>
          {loadingOrganization ? <Loading /> : (
            <select
              value={values.connectionId}
              onChange={(event) => setValues((prev) => ({ ...prev, connectionId: event.target.value }))}
            >
              {validConnection.map((connection) => (
                <option
                  key={connection.name}
                  value={connection.connectionId}
                >
                  {connection.displayName}
                </option>
              ))}
            </select>
          )}
        </label>
        <label>
          <div>Member</div>
          <select
            value={values.userId}
            onChange={(event) => setValues((prev) => ({ ...prev, userId: event.target.value }))}
          >
            {loadingOrganizationMembers ? <Loading /> : (
              validMembers.map((member) => (
                <option
                  key={member.user_id}
                  value={member.user_id}
                >
                  {member.email}
                </option>
              ))
            )}
          </select>
        </label>
        <input type="submit" value="Create" disabled={!canSubmit} />
      </form>
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({})


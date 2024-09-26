import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Messages } from '@/components/message/Messages'
import { useMessages } from '@/hooks/useMessages'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'
import { useOrganizationConnections } from '@/hooks/useOrganizationConnections'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/session'
import { Loading } from '@/components/loading/Loading'

export default function UsersNewPage(props: Auth0Session) {
  const { organization: { orgIdWithoutPrefix } } = props
  const { errorMessages, removeMessage, addMessage } = useMessages()
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation({ addMessage })
  const { connections, loading } = useOrganizationConnections()

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
              {connections.map((connection) => (
                <option
                  key={connection.connection_id}
                  value={connection.connection_id}
                >
                  {connection.connection.name.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '')}
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
      <Messages errorMessages={errorMessages} removeMessage={removeMessage} />
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsForSession,
})


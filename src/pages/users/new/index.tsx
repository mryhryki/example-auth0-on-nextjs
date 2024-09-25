import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Messages } from '@/components/message/Messages'
import { useMessages } from '@/hooks/useMessages'
import { useCreateNewInvitation } from '@/hooks/useCreateNewInvitation'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'

interface Connection {
  id: string
  name: string
}

interface UsersNewPageProps {
  connections: Connection[];
}

export default function UsersNewPage(props: UsersNewPageProps) {
  const {connections} = props
  const { errorMessages, removeMessage, addMessage } = useMessages()
  const { values, setValues, canSubmit, onSubmit } = useCreateNewInvitation({ addMessage })

  return (
    <section>
      <h1>Create an Invitation</h1>
      <form onSubmit={onSubmit}>
        <label>
          <div>Connection</div>
          <select
            value={values.connectionId}
            onChange={(event) => setValues((prev) => ({ ...prev, connectionId: event.target.value }))}
          >
            {connections.map((connection) => (
              <option key={connection.id} value={connection.id}>{connection.name}</option>
            ))}
          </select>
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
  getServerSideProps: async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx.req, ctx.res)
    // console.debug('Session:', JSON.stringify(session, null, 2))
    const { user } = session ?? {}

    const orgId = user?.org_id ?? '(No org_id)'

    const { data } = await auth0ManagementClient.organizations.getEnabledConnections({
      id: orgId,
      page: 0,
      per_page: 100,
      include_totals: true,
    })

    const orgIdWithoutPrefix = orgId.substring('org_'.length)

    const props: UsersNewPageProps = {
      connections: data.enabled_connections.map((connection): Connection => ({
        id: connection.connection_id ?? '(No connection_id)',
        name: connection.connection.name?.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '') ?? '(No name)',
      })),
    }
    return { props }
  },
})


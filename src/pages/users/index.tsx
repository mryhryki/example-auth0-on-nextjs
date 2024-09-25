import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { GetServerSidePropsContext } from 'next'
import { auth0ManagementClient } from '@/utils/auth0'
import Link from 'next/link'

interface OrganizationMember {
  user_id?: string | undefined;
  picture?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
}

interface OrganizationInvitation {
  id: string;
  organization_id: string;
  inviter: {
    name: string;
  };
  invitee: {
    email: string;
  };
  invitation_url: string;
  created_at: string;
  expires_at: string;
  connection_id?: string | undefined;
  client_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app_metadata?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user_metadata?: any;
  ticket_id: string;
  roles?: string[] | undefined;
}


interface UsersPageProps {
  users: OrganizationMember[]
  invitations: OrganizationInvitation[]
}

export default function UsersPage(props: UsersPageProps) {
  const { users, invitations } = props

  return (
    <>
      <h1>Users</h1>
      <section>
        <h2>1. Users</h2>
        <ol>
          {users.map((user, i) => (
            <li key={user.user_id ?? i.toString()}>
              <strong>{user.email ?? '(No email)'}</strong>
              (<strong>{user.user_id ?? 'No user_id'}</strong>)
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>2. Invitations</h2>
        <ol>
          {invitations.map((invitation) => (
            <li key={invitation.id}>
              <strong>{invitation.invitee.email}</strong>
              <ul>
                <li>Connection: <strong>{invitation.connection_id}</strong></li>
                <li>Created: <strong>{invitation.created_at}</strong></li>
                <li>Expires: <strong>{invitation.expires_at}</strong></li>
              </ul>
            </li>
          ))}
        </ol>
        <Link href="/users/new">Create an invitation</Link>
      </section>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getSession(ctx.req, ctx.res)
    // console.debug('Session:', JSON.stringify(session, null, 2))
    const { user } = session ?? {}
    const orgId: string = user?.org_id ?? '(No org_id)'

    const { data: users } = await auth0ManagementClient.organizations.getMembers({ id: orgId, page: 0, per_page: 100 })
    const { data: invitations } = await auth0ManagementClient.organizations.getInvitations({
      id: orgId,
      page: 0,
      per_page: 100,
    })

    const props: UsersPageProps = { users, invitations }
    return { props }
  },
})


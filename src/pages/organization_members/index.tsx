import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { Loading } from '@/components/loading/Loading'
import { useOrganizationInvitations } from '@/hooks/useOrganizationInvitations'
import { useOrganization } from '@/hooks/useOrganization'

export default function UsersPage() {
  const { members, loading: loadingMembers } = useOrganizationMembers()
  const { invitations, loading: loadingInvitations } = useOrganizationInvitations()
  const { connectionsByOrganizationMetadata, loading: loadingOrganization } = useOrganization()

  return (
    <>
      <h1>Users</h1>
      <section>
        <h2>1. Users</h2>
        {loadingMembers ? <Loading /> : (
          <ol>
            {members.map((member, i) => (
              <li key={member.user_id ?? i.toString()}>
                <strong>{member.email ?? '(No email)'}</strong>
                <ul>
                  <li>ID:<strong>{member.user_id ?? 'No user_id'}</strong></li>
                  <li>Connections:
                    {(member.rawUserData?.identities?.length ?? 0) > 0 && (
                      member.rawUserData?.identities.map((identity) => (
                      <strong key={identity.connection}>
                        {identity.connection}
                      </strong>
                      ))
                    )}
                  </li>
                </ul>
              </li>
            ))}
        </ol>
        )}
      </section>
      <section>
        <h2>2. Invitations</h2>
        <Link href="/organization_members/new">Create an invitation</Link>
        {loadingInvitations ? <Loading /> : (
          <ol>
            {invitations.map((invitation) => (
              <li key={invitation.id}>
                <strong>{invitation.invitee.email}</strong>
                <ul>
                  <li>
                    Connection:{loadingOrganization ? <Loading /> : (
                      <strong>
                        {connectionsByOrganizationMetadata.find((connection) => connection.connectionId ===
                                                          invitation.connection_id)?.name ?? '(Unknown)'}
                      </strong>
                    )}
                    (ID:<strong>{invitation.connection_id ?? '(Unknown)'}</strong>)
                  </li>
                  <li>Created:<strong>{invitation.created_at}</strong></li>
                  <li>Expires:<strong>{invitation.expires_at}</strong></li>
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({})


import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { Loading } from '@/components/loading/Loading'
import { useOrganizationInvitations } from '@/hooks/useOrganizationInvitations'
import { useOrganization } from '@/hooks/useOrganization'
import { useRemoveUserConnection } from '@/hooks/useRemoveUserConnection'
import { useUpdateUserMetadata } from '@/hooks/useUpdateUserMetadata'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/auth0/session'

export default function UsersPage(props: Auth0Session) {
  const { user } = props

  const { members, loading: loadingMembers, reload: reloadMembers } = useOrganizationMembers()
  const { invitations, loading: loadingInvitations } = useOrganizationInvitations()
  const { connectionsByOrganizationMetadata, loading: loadingOrganization } = useOrganization()
  const { removeUserConnection, loading: loadingRemoveUserConnection } = useRemoveUserConnection()
  const { updateUserMetadata, updating } = useUpdateUserMetadata()

  return (
    <>
      <h1>Organization Members</h1>
      <section>
        <h2>1. Users</h2>
        <Link href="/organization_members/new">Create a user</Link>
        {loadingMembers ? <Loading /> : (
          <ol>
            {members.map((member, i) => {
              const isMe = member.user_id === user.sub
              const identities = member.rawUserData?.identities ?? []
              const isAdministrator = member.rawUserData?.app_metadata?.['isAdministrator'] === true
              return (
                <li key={member.user_id ?? i.toString()}>
                  <strong>{member.email ?? '(No email)'}</strong>
                  {isMe && <span className="label">ME</span>}
                  <ul>
                    <li>ID:<strong>{member.user_id ?? 'No user_id'}</strong></li>
                    <li>
                      Admin: <strong>{isAdministrator ? 'Yes' : 'No'}</strong>
                      <button
                        onClick={() => updateUserMetadata(
                          member.user_id ?? '',
                          { isAdministrator: !isAdministrator },
                        ).then(reloadMembers)}
                        disabled={updating}
                      >
                        → {isAdministrator ? 'Remove' : 'Change to Admin'}
                      </button>
                    </li>
                    <li>Connections:
                      <ul>
                        {identities.map((identity) => {
                          const canRemove = identities.length >= 2 &&
                                            identity.connection !== 'Username-Password-Authentication'
                          return (
                            <li key={identity.connection}>
                              <strong key={identity.connection}>
                                {identity.connection}
                              </strong>
                              {canRemove && (loadingRemoveUserConnection ? <Loading /> : (
                                <button
                                  onClick={() => removeUserConnection(
                                    member.user_id ?? '',
                                    identity.provider,
                                    identity.user_id,
                                  ).then(reloadMembers)}
                                >
                                  → Remove
                                </button>
                              ))}
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </ul>
                </li>
              )
              },
            )}
        </ol>
        )}
      </section>
      <section>
        <h2>2. Invitations</h2>
        <Link href="/organization_members/invite">Create an invitation</Link>
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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsForSession,
})

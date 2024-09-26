import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Auth0Session, getAuth0Session } from '@/utils/session'
import { Loading } from '@/components/loading/Loading'
import { useOrganizationConnection } from '@/hooks/useOrganizationConnection'
import { GetServerSidePropsContext } from 'next'

interface SsoConfigurationPageProps extends Auth0Session {
  connectionId: string,
}

export default function SsoConfigurationPage(props: SsoConfigurationPageProps) {
  const { organization, connectionId } = props
  const { orgIdWithoutPrefix, displayName, enableSSO } = organization

  const { loading, connection } = useOrganizationConnection({ connectionId })

  return (
    <section>
      <h1>SSO Configuration</h1>
      {(() => {
        if (!enableSSO) {
          return (
            <p>
              <strong>{displayName}</strong> (Name: <strong>{organization.orgName}</strong>) organization is not enabled SSO.
            </p>
          )
        }
        if (loading) {
          return <Loading />
        }
        if (connection == null) {
          return <p>(Not Found)</p>
        }
        return (
          <section>
            <ul>
              <li>ID: <strong>{connection.connection_id}</strong></li>
              <li>Name: <strong>{connection.connection.name.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '')}</strong>
              </li>
              <li>Strategy: <strong>{connection.connection.strategy}</strong></li>
            </ul>
          </section>
        )
      })()}
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx: GetServerSidePropsContext) => {
    const session = await getAuth0Session(ctx.req, ctx.res)
    const connectionId = ctx.params?.connectionId as string
    const props: SsoConfigurationPageProps = { ...session, connectionId }
    return { props }
  },
})


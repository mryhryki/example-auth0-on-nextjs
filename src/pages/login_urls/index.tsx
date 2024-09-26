import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { Auth0Session, getServerSidePropsForSession } from '@/utils/session'
import { useOrganizationConnections } from '@/hooks/useOrganizationConnections'
import { Loading } from '@/components/loading/Loading'
import Link from 'next/link'

export default function AccessInfoPage(props: Auth0Session) {
  const { organization: { orgId, orgIdWithoutPrefix } } = props

  const base = `/api/auth/login?organization=${orgId}`
  const { loading, connections } = useOrganizationConnections()

  return (
    <section>
      <h2>Login URLs</h2>
      <ul>
        <li>Not specified login method: <Link href={base}>{base}</Link></li>
        {loading ? <Loading /> :
          connections.map((connection) => {
            const name = connection.connection.name.replace(new RegExp(`^${orgIdWithoutPrefix}-`), '')
            const url = `${base}&connection=${connection.connection_id}`
            return (
              <li key={connection.connection_id}>
                {name}: <Link href={url}>{url}</Link>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsForSession,
})


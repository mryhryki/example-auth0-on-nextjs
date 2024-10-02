import { GetServerSidePropsContext } from 'next'
import { filterString } from '@/utils/string'
import Link from 'next/link'
import {
  Auth0ConnectionByOrganizationMetadata,
  getConnectionByOrganizationMetadata,
} from '@/utils/auth0/getConnectionByOrganizationMetadata'
import { auth0ManagementClient } from '@/utils/auth0/client'

interface SelectLoginPageProps {
  organization: string | null
  connection: string | null
  otherOrganizations: Auth0ConnectionByOrganizationMetadata[]
}

SelectLoginPage.disableDefaultLayout = true
export default function SelectLoginPage(props: SelectLoginPageProps) {
  const { connection, organization, otherOrganizations } = props

  const previousOrganizationLoginUrl = `/api/auth/login?organization=${organization}`;
  const previousLoginMethodUrl = `/api/auth/login?organization=${organization}&connection=${connection}`;
  const loginWithIdAndPasswordUrl = '/api/auth/login?connection=Username-Password-Authentication';

  return (
    <main style={{ maxWidth: '40rem', margin: '0 auto' }}>
      <h1>Choose the Login Method</h1>

      <p>If you would like to login to same organization, please click the following link:</p>
      <Link href={previousOrganizationLoginUrl}>
        {previousOrganizationLoginUrl}
      </Link>

      {connection != null && (
        <>
          <p>If you would like to login using the same method as last time, please click the following link:</p>
          <Link href={previousLoginMethodUrl}>
            {previousLoginMethodUrl}
          </Link>
        </>
      )}

      {otherOrganizations.length > 0 && (
        <>
          <p>If you would like to login with other connection, please click the following link:</p>
          <ul>
            {otherOrganizations.map((connection) => {
              const url = `/api/auth/login?organization=${organization}&connection=${connection.name}`
              return (
                <li key={connection.name}>
                  <Link href={url}>
                    {url}
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <p>If you would like to login using your email and password, please click the following link:</p>
      <Link href={loginWithIdAndPasswordUrl}>
        {loginWithIdAndPasswordUrl}
      </Link>

      <p>If you would like to login with other organization, please use the exclusive link.</p>
    </main>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const organizationName = filterString(ctx.query.organization)
  const connectionName = filterString(ctx.query.connection)

  const otherOrganizations = organizationName == null ? [] :
    getConnectionByOrganizationMetadata((await auth0ManagementClient.organizations.getByName({ name: organizationName })).data.metadata)
      .filter((connection) => connection.name !== connectionName)

  const props: SelectLoginPageProps = {
    organization: organizationName,
    connection: connectionName,
    otherOrganizations,
  }
  return { props }
}

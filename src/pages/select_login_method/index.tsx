import { GetServerSidePropsContext } from 'next'
import { filterString } from '@/utils/string'
import Link from 'next/link'

interface SelectLoginPageProps {
  organization: string | null
  connection: string | null
}

SelectLoginPage.disableDefaultLayout = true
export default function SelectLoginPage(props: SelectLoginPageProps) {
  const { connection, organization } = props

  const previousLoginMethodUrl = `/api/auth/login?organization=${organization}&connection=${connection}`;
  const loginWithIdAndPasswordUrl = '/api/auth/login?connection=Username-Password-Authentication';

  return (
    <main style={{ maxWidth: '40rem', margin: '0 auto'}}>
      <h1>Choose the Login Method</h1>

      <p>If you would like to log in using the same method as last time, please click the following link:</p>
      <Link href={previousLoginMethodUrl}>
        {previousLoginMethodUrl}
      </Link>

      <p>If you would like to log in using your ID and password, please click the following link:</p>
      <Link href={loginWithIdAndPasswordUrl}>
        {loginWithIdAndPasswordUrl}
      </Link>

      <p>If you need to log in with another organization or connection, please use the exclusive links.</p>
    </main>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const organization = filterString(ctx.query.organization);
  const connection = filterString(ctx.query.connection);

  const props: SelectLoginPageProps = {
    organization,
    connection,
  }
  return { props }
}

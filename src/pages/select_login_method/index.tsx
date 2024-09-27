import { GetServerSidePropsContext } from 'next'
import { filterString } from '@/utils/string'
import Link from 'next/link'

interface SelectLoginPageProps {
  organization: string | null
  connection: string | null
}

export default function SelectLoginPage(props: SelectLoginPageProps) {
  const { connection, organization } = props

  return (
    <section>
      <h2>Select Login Method</h2>
      <ul>
        <li>
          <Link href={`/api/auth/login?organization=${organization}&connection=${connection}`}>
            Use the previous method
          </Link>
        </li>
        <li>(TODO)</li>
      </ul>
    </section>
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


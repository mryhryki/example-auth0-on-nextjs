import { FC } from 'react'
import styles from '@/pages/_app.module.css'
import Link from 'next/link'

export const AppSideBar: FC = () => {
  return (
    <div className={styles.sideBar}>
      <Link href='/access_info'>Access Info</Link>
      <Link href='/sso_configuration'>SSO Configuration</Link>
      <Link href="/api/auth/logout">Logout</Link>
    </div>
  )
}

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client'
import { FC } from 'react'
import Link from 'next/link'
import styles from '@/pages/_app.module.css'

const AppHeader: FC = () => {
  const { user } = useUser()
  const email = user?.email ?? '(Unknown email)'
  return (
    <div className={styles.header}>
      <div>{email}</div>
      <a href="https://github.com/mryhryki/example-auth0-on-nextjs" target="_blank">GitHub</a>
    </div>
  )

}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className={styles.wrapper}>
        <AppHeader />
        <div className={styles.sideBar}>
          <Link href='/access_info'>Access Info</Link>
          <Link href="/api/auth/logout">Logout</Link>
        </div>
        <div className={styles.content}>
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

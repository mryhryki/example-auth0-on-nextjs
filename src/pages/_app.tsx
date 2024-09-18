import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client'
import styles from '@/pages/_app.module.css'
import { FC } from 'react'
import Link from 'next/link'

const AppHeader: FC = () => {
  const { user } = useUser()
  const email = user?.email ?? '(Unknown email)'
  return (<div className={styles.header}>
    <div>{email}</div>
    <Link href="/api/auth/logout">Logout</Link>
  </div>)

}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className={styles.wrapper}>
        <AppHeader />
        <div className={styles.sideBar}>
          <a className={styles.sideBarLink} href='/me'>My Info</a>
        </div>
        <div className={styles.content}>
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

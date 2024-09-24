import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import styles from '@/pages/_app.module.css'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSideBar } from '@/components/layout/AppSideBar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className={styles.wrapper}>
        <AppHeader />
        <AppSideBar />
        <div className={styles.content}>
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

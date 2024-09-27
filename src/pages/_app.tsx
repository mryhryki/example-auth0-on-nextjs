import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import styles from '@/pages/_app.module.css'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSideBar } from '@/components/layout/AppSideBar'
import { Messages } from '@/components/message/Messages'

export default function App({ Component, pageProps }: AppProps) {
  if (('disableDefaultLayout' in Component) && Component.disableDefaultLayout) {
    return (
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    )
  }

  return (
    <UserProvider>
      <div className={styles.wrapper}>
        <AppHeader />
        <AppSideBar />
        <div className={styles.content}>
          <Component {...pageProps} />
        </div>
      </div>
      <Messages />
    </UserProvider>
  )
}

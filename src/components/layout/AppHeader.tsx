import { FC } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import styles from '@/pages/_app.module.css'

export const AppHeader: FC = () => {
  const { user } = useUser()
  const email = user?.email ?? '(Unknown email)'
  return (
    <div className={styles.header}>
      <div>{email}</div>
      <a href="https://github.com/mryhryki/example-auth0-on-nextjs" target="_blank">GitHub</a>
    </div>
  )
}
